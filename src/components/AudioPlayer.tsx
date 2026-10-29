import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Pause, Play, Loader2, RotateCcw } from 'lucide-react';

interface AudioPlayerProps {
  textToSpeak: string;
  title?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ textToSpeak, title = "Ouvir Explicação" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioSource, setAudioSource] = useState<'gemini' | 'browser' | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Stop any speech when text changes or component unmounts
    stopAudio();
    return () => {
      stopAudio();
    };
  }, [textToSpeak]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsLoading(false);
  };

  const playBrowserTTS = () => {
    if (!('speechSynthesis' in window)) {
      alert('Seu navegador não suporta leitura em voz alta.');
      setIsLoading(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick a Portuguese voice if available
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.startsWith('pt') || v.lang.includes('BR'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onstart = () => {
      setIsLoading(false);
      setIsPlaying(true);
      setAudioSource('browser');
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    setIsLoading(true);

    // Attempt Gemini Neural TTS first via /api/tts
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak.slice(0, 800) }),
      });

      if (!response.ok) {
        throw new Error('Falha no TTS do servidor, usando síntese nativa');
      }

      const data = await response.json();
      if (data.audioBase64) {
        const audioUrl = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        audioRef.current.src = audioUrl;
        
        audioRef.current.onended = () => {
          setIsPlaying(false);
        };
        
        audioRef.current.onerror = () => {
          console.warn('Erro ao reproduzir áudio do servidor, usando leitor nativo');
          playBrowserTTS();
        };

        await audioRef.current.play();
        setAudioSource('gemini');
        setIsLoading(false);
        setIsPlaying(true);
        return;
      }
    } catch (err) {
      console.info('Recorrendo à voz do navegador (Web Speech API):', err);
    }

    // Fallback to browser Web Speech API
    playBrowserTTS();
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleTogglePlay}
        disabled={isLoading || !textToSpeak}
        title={isPlaying ? "Pausar áudio" : "Ouvir em voz alta (acessibilidade)"}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-sm ${
          isPlaying
            ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
            : 'bg-emerald-700 hover:bg-emerald-800 text-white'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Gerando voz...</span>
          </>
        ) : isPlaying ? (
          <>
            <Pause className="w-4 h-4" />
            <span>Pausar Áudio</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            <span>{title}</span>
          </>
        )}
      </button>

      {isPlaying && (
        <button
          onClick={stopAudio}
          title="Parar áudio"
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}

      {audioSource && isPlaying && (
        <span className="text-[11px] font-medium text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full hidden sm:inline">
          {audioSource === 'gemini' ? 'Voz Neural Gemini' : 'Voz do Navegador'}
        </span>
      )}
    </div>
  );
};

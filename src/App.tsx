/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { SampleSelector } from './components/SampleSelector';
import { InputSection } from './components/InputSection';
import { ResultSection } from './components/ResultSection';
import { HistoryDrawer } from './components/HistoryDrawer';
import { LegalSample } from './data/samples';
import { SimplifiedResult, SimplificationHistoryItem, AccessibilityTextSize } from './types';
import { parseLegalTextRuleBased } from './utils/legalParser';
import { Scale, HeartHandshake, AlertCircle, Phone, Globe, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [docType, setDocType] = useState('geral');
  const [temperature, setTemperature] = useState(0.3);
  const [selectedSampleId, setSelectedSampleId] = useState<string | undefined>();
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<SimplifiedResult | null>(null);
  
  // Accessibility states
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState<AccessibilityTextSize>('md');
  
  // History & Feedback
  const [history, setHistory] = useState<SimplificationHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState<'up' | 'down' | null>(null);

  const inputSectionRef = useRef<HTMLDivElement | null>(null);
  const resultSectionRef = useRef<HTMLDivElement | null>(null);

  // Load history from localStorage on start
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tjrr_linguagem_simples_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // Storage access issue fallback
    }
  }, []);

  const saveToHistory = (item: SimplificationHistoryItem) => {
    try {
      const updated = [item, ...history.slice(0, 19)];
      setHistory(updated);
      localStorage.setItem('tjrr_linguagem_simples_history', JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('tjrr_linguagem_simples_history');
    } catch {
      // Ignore
    }
  };

  const executeSimplification = async (textToProcess: string, docTypeToUse: string, tempToUse: number) => {
    if (!textToProcess.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setCurrentRating(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s maximum client wait

    try {
      const response = await fetch('/api/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          text: textToProcess,
          docType: docTypeToUse,
          targetAudience: 'cidadao',
          temperature: tempToUse,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Servidor respondeu com status ${response.status}`);
      }

      const resData = await response.json();
      if (!resData.data) {
        throw new Error('Formato inválido de resposta.');
      }

      const result: SimplifiedResult = resData.data;
      setCurrentResult(result);

      saveToHistory({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: Date.now(),
        originalText: textToProcess,
        docType: docTypeToUse,
        result,
      });

      // Smooth scroll to result
      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);

    } catch (err: any) {
      console.warn('Conexão ao Gemini excedeu o limite ou falhou, ativando motor semântico TJRR imediato:', err);
      // Instant client-side fallback guarantee
      try {
        const fallbackResult = parseLegalTextRuleBased(textToProcess, docTypeToUse);
        setCurrentResult(fallbackResult);
        saveToHistory({
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: Date.now(),
          originalText: textToProcess,
          docType: docTypeToUse,
          result: fallbackResult,
        });
        setTimeout(() => {
          resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      } catch (clientErr) {
        setErrorMessage('Não foi possível simplificar este documento no momento. Tente novamente.');
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sample: LegalSample, autoRun: boolean = false) => {
    setSelectedSampleId(sample.id);
    setInputText(sample.originalText);
    
    // Auto-detect doc type
    let detectedDocType = 'geral';
    if (sample.category === 'Despacho') detectedDocType = 'despacho';
    else if (sample.category === 'Sentença') detectedDocType = 'sentenca';
    else if (sample.category === 'Decisão Liminar') detectedDocType = 'liminar';
    else if (sample.category === 'Ementa') detectedDocType = 'ementa';
    else detectedDocType = 'intimacao';
    
    setDocType(detectedDocType);
    setErrorMessage(null);

    if (autoRun) {
      executeSimplification(sample.originalText, detectedDocType, temperature);
    } else {
      setTimeout(() => {
        inputSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const handleSimplify = () => {
    executeSimplification(inputText, docType, temperature);
  };

  const handleRatingSubmit = (rating: 'up' | 'down', feedbackNotes?: string) => {
    setCurrentRating(rating);
    if (history.length > 0) {
      const updated = [...history];
      updated[0] = {
        ...updated[0],
        userRating: rating,
        ratingFeedback: feedbackNotes,
      };
      setHistory(updated);
      try {
        localStorage.setItem('tjrr_linguagem_simples_history', JSON.stringify(updated));
      } catch {
        // Ignore
      }
    }
  };

  const handleSelectHistoryItem = (item: SimplificationHistoryItem) => {
    setInputText(item.originalText);
    setDocType(item.docType);
    setCurrentResult(item.result);
    setCurrentRating(item.userRating || null);
    setSelectedSampleId(undefined);
    setTimeout(() => {
      resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      highContrast ? 'high-contrast bg-black text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Institutional Top Navbar with accessibility controls */}
      <Navbar
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        textSize={textSize}
        onChangeTextSize={setTextSize}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Institutional Hero Banner */}
        <section className={`rounded-3xl p-6 sm:p-8 border shadow-sm relative overflow-hidden transition-all ${
          highContrast
            ? 'bg-neutral-900 border-yellow-400 text-white'
            : 'bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 border-emerald-800/40 text-white'
        }`}>
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-300" />
              <span>Justiça para Todos • Linguagem Simples e Empática</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Tradutor de &ldquo;Juridiquês&rdquo; para Linguagem Cidadã
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
              Transforme despachos, sentenças, ementas e intimações judiciais em mensagens claras, diretas e compreensíveis para o cidadão, em cumprimento às diretrizes do <strong>Conselho Nacional de Justiça (CNJ)</strong> e do <strong>TJRR</strong>.
            </p>
          </div>
        </section>

        {/* 1-Click Realistic Court Samples */}
        <SampleSelector
          onSelectSample={handleSelectSample}
          selectedSampleId={selectedSampleId}
          highContrast={highContrast}
          isLoading={isLoading}
        />

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold">Atenção ao processar:</span> {errorMessage}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div ref={inputSectionRef}>
          <InputSection
            text={inputText}
            onChangeText={setInputText}
            docType={docType}
            onChangeDocType={setDocType}
            temperature={temperature}
            onChangeTemperature={setTemperature}
            onSubmit={handleSimplify}
            isLoading={isLoading}
            highContrast={highContrast}
          />
        </div>

        {/* Result Area (Rendered when translation is ready) */}
        {currentResult && (
          <div ref={resultSectionRef}>
            <ResultSection
              result={currentResult}
              originalText={inputText}
              textSize={textSize}
              highContrast={highContrast}
              onRatingSubmit={handleRatingSubmit}
              currentRating={currentRating}
            />
          </div>
        )}

        {/* Informative Guidance Cards for Servidores & Cidadãos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className={`p-4 rounded-xl border ${
            highContrast ? 'bg-neutral-900 border-yellow-400' : 'bg-white border-slate-200'
          }`}>
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-1.5">
              <Scale className="w-4 h-4 text-emerald-600" />
              1. Resumo em Ordem Direta
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explica o fato processual em 1 ou 2 frases curtas com sujeito, verbo e complemento, sem frases invertidas ou prolixas.
            </p>
          </div>

          <div className={`p-4 rounded-xl border ${
            highContrast ? 'bg-neutral-900 border-yellow-400' : 'bg-white border-slate-200'
          }`}>
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-1.5">
              <Globe className="w-4 h-4 text-emerald-600" />
              2. Tradução dos Jargões
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Substitui expressões arcaicas e em latim (*in limine*, *exordial*, *revelia*) por explicações claras do cotidiano.
            </p>
          </div>

          <div className={`p-4 rounded-xl border ${
            highContrast ? 'bg-neutral-900 border-yellow-400' : 'bg-white border-slate-200'
          }`}>
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-1.5">
              <Phone className="w-4 h-4 text-emerald-600" />
              3. Próximos Passos & Prazos
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Orienta o cidadão sobre o que ele precisa fazer agora, prazos em dias úteis e se precisa de advogado ou da Defensoria Pública (DPE-RR).
            </p>
          </div>
        </div>
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={history}
        onSelectItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />

      {/* Institutional Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-8 text-slate-600 text-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900">
                Tribunal de Justiça do Estado de Roraima (TJRR)
              </p>
              <p className="text-slate-500">
                Alinhado à Resolução do Conselho Nacional de Justiça (CNJ) sobre Linguagem Simples
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            <span className="font-medium text-emerald-800">Canais de Apoio ao Cidadão:</span>
            <span className="text-slate-700 font-semibold">Balcão Virtual TJRR</span>
            <span>•</span>
            <span className="text-slate-700 font-semibold">Defensoria Pública (DPE-RR)</span>
            <span>•</span>
            <span className="text-slate-700 font-semibold">Ouvidoria da Justiça</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

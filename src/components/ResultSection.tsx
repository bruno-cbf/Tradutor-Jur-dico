import React, { useState } from 'react';
import { 
  Check, 
  Copy, 
  Printer, 
  Share2, 
  ThumbsUp, 
  ThumbsDown, 
  AlertTriangle, 
  Calendar, 
  HelpCircle, 
  Sparkles, 
  BookA, 
  Columns, 
  FileText,
  UserCheck,
  Scale,
  Send,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { SimplifiedResult, AccessibilityTextSize } from '../types';
import { AudioPlayer } from './AudioPlayer';

interface ResultSectionProps {
  result: SimplifiedResult;
  originalText: string;
  textSize: AccessibilityTextSize;
  highContrast: boolean;
  onRatingSubmit: (rating: 'up' | 'down', feedback?: string) => void;
  currentRating?: 'up' | 'down' | null;
}

export const ResultSection: React.FC<ResultSectionProps> = ({
  result,
  originalText,
  textSize,
  highContrast,
  onRatingSubmit,
  currentRating,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [viewMode, setViewMode] = useState<'structured' | 'comparison' | 'plain'>('structured');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Dynamic font size classes
  const fontSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const handleCopyFormatted = async () => {
    const textToCopy = `🏛️ TRIBUNAL DE JUSTIÇA DE RORAIMA (TJRR)
Tradução para Linguagem Simples (Pacto CNJ)

📌 RESUMO:
${result.summary}

💡 O QUE ISSO SIGNIFICA:
${result.meaning}

📋 PRÓXIMOS PASSOS:
${result.nextSteps.map(step => `• ${step}`).join('\n')}

⏱️ PRAZOS:
${result.deadlineInfo}

⚖️ ADVOGADO OU DEFENSORIA PÚBLICA (DPE-RR):
${result.needsLawyer || 'Consulte seu advogado constituído ou procure a Defensoria Pública do Estado de Roraima (DPE-RR) se não tiver condições financeiras.'}
`;

    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyWhatsApp = async () => {
    const whatsAppMessage = `*Tribunal de Justiça de Roraima (TJRR)* ⚖️
_Informação em Linguagem Simples_

*1. Resumo:*
${result.summary}

*2. O que isso quer dizer:*
${result.meaning}

*3. O que você precisa fazer:*
${result.nextSteps.map(step => `👉 ${step}`).join('\n')}

*Atenção aos Prazos:* ${result.deadlineInfo}
${result.needsLawyer ? `\n*Defensoria / Advogado:* ${result.needsLawyer}` : ''}`;

    await navigator.clipboard.writeText(whatsAppMessage);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRate = (type: 'up' | 'down') => {
    onRatingSubmit(type);
    setShowFeedbackModal(true);
    setRatingSubmitted(true);
  };

  const handleSubmitFeedbackDetails = () => {
    if (currentRating) {
      onRatingSubmit(currentRating, feedbackNotes);
    }
    setShowFeedbackModal(false);
  };

  // Full speech text for AudioPlayer
  const speechText = `Resumo da decisão: ${result.summary}. O que isso significa: ${result.meaning}. Próximos passos: ${result.nextSteps.join('. ')}. Prazos informados: ${result.deadlineInfo}.`;

  return (
    <div className={`rounded-2xl border transition-all p-5 sm:p-7 shadow-sm mt-6 ${
      highContrast 
        ? 'bg-black border-yellow-400 text-white' 
        : 'bg-white border-slate-200'
    }`}>
      {/* Top Bar: Title, View Switcher & Audio Player */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Linguagem Simples • Pacto CNJ
            </span>
            {result.outcome && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {result.outcome}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Texto Traduzido para o Cidadão
          </h2>
        </div>

        {/* Action Controls: Audio, View Mode, Copy */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Audio Player */}
          <AudioPlayer textToSpeak={speechText} title="Ouvir Tradução" />

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 text-xs">
            <button
              onClick={() => setViewMode('structured')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'structured' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Formato padrão por tópicos"
            >
              Estruturado
            </button>
            <button
              onClick={() => setViewMode('comparison')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'comparison' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Comparar lado a lado texto original e traduzido"
            >
              Lado a Lado
            </button>
            <button
              onClick={() => setViewMode('plain')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'plain' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Texto corrido contínuo"
            >
              Texto Corrido
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyFormatted}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1.5 transition-colors"
            title="Copiar texto traduzido"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Copiar</span>
              </>
            )}
          </button>

          {/* WhatsApp / SMS Fast Copy */}
          <button
            onClick={handleCopyWhatsApp}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 transition-colors"
            title="Copiar formato adaptado para WhatsApp / Balcão Virtual"
          >
            {copiedWhatsApp ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Pronto!</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-emerald-700" />
                <span>Zap / Balcão</span>
              </>
            )}
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Imprimir ou salvar PDF do comunicado"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Areas based on ViewMode */}
      {viewMode === 'structured' && (
        <div className="space-y-6 pt-5">
          {/* Critical Highlights (Deadlines & Next Actions) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Deadline Box */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              result.hasActionRequired
                ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                : 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
            }`}>
              <div className={`p-2 rounded-lg mt-0.5 ${
                result.hasActionRequired ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
              }`}>
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wide opacity-80">
                  Prazo & Urgência:
                </span>
                <p className="text-sm font-semibold mt-0.5">
                  {result.deadlineInfo}
                </p>
              </div>
            </div>

            {/* Assistance / Defensoria Box */}
            <div className="p-4 rounded-xl border bg-blue-50/70 border-blue-200 text-blue-950 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-200 text-blue-900 mt-0.5">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wide opacity-80">
                  Advogado / Defensoria Pública (DPE-RR):
                </span>
                <p className="text-sm font-semibold mt-0.5">
                  {result.needsLawyer || 'Se tiver dúvidas ou prazos, procure a Defensoria Pública de Roraima ou advogado.'}
                </p>
              </div>
            </div>
          </div>

          {/* 1. RESUMO (Required format item 1) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h3 className="font-bold text-slate-900 text-base">
                Resumo do Processo
              </h3>
            </div>
            <p className={`text-slate-800 leading-relaxed font-medium pl-8 ${fontSizes[textSize]}`}>
              {result.summary}
            </p>
          </div>

          {/* 2. O QUE ISSO SIGNIFICA (Required format item 2) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h3 className="font-bold text-slate-900 text-base">
                O que isso significa na prática
              </h3>
            </div>
            <p className={`text-slate-800 leading-relaxed pl-8 ${fontSizes[textSize]}`}>
              {result.meaning}
            </p>
          </div>

          {/* 3. PRÓXIMOS PASSOS (Required format item 3) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h3 className="font-bold text-slate-900 text-base">
                Próximos Passos (O que você precisa fazer agora)
              </h3>
            </div>
            <div className="pl-8">
              {result.nextSteps && result.nextSteps.length > 0 ? (
                <ul className="space-y-2 mt-2">
                  {result.nextSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-slate-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0" />
                      <span className={`font-medium ${fontSizes[textSize]}`}>{step}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-600 text-sm italic">
                  Nenhuma providência imediata é exigida de você neste momento. O processo continuará seus trâmites normais.
                </p>
              )}
            </div>
          </div>

          {/* 4. GLOSSÁRIO DIDÁTICO DOS TERMOS IDENTIFICADOS */}
          {result.glossary && result.glossary.length > 0 && (
            <div className="border border-slate-200 rounded-xl p-5 bg-gradient-to-br from-amber-50/50 to-orange-50/30">
              <div className="flex items-center gap-2 mb-3">
                <BookA className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                  Glossário Jurídico: O que significam esses termos?
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.glossary.map((item, idx) => (
                  <div key={idx} className="bg-white/90 p-3 rounded-lg border border-amber-200/70 shadow-xs">
                    <span className="font-bold text-amber-900 text-xs block mb-1">
                      {item.term}
                    </span>
                    <span className="text-xs text-slate-700 leading-snug block">
                      {item.definition}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Side by Side Comparison Mode */}
      {viewMode === 'comparison' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-5">
          {/* Original Legal Text */}
          <div className="bg-slate-50 border border-slate-300 rounded-xl p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <span className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                Texto Jurídico Original (TJRR)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {originalText.length} caracteres
              </span>
            </div>
            <div className="font-mono text-xs text-slate-700 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto pr-2">
              {originalText}
            </div>
          </div>

          {/* Simplified Citizen Text */}
          <div className="bg-emerald-50/40 border border-emerald-300 rounded-xl p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-200">
              <span className="font-bold text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                Linguagem Simples Traduzida (Pacto CNJ)
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">
                Ordem Direta & Didática
              </span>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase block mb-1">
                  Resumo:
                </span>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {result.summary}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase block mb-1">
                  O que significa:
                </span>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {result.meaning}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase block mb-1">
                  Próximos Passos:
                </span>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-800">
                  {result.nextSteps.map((step, i) => (
                    <li key={i} className="font-medium">{step}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-white/80 rounded-lg border border-emerald-200 text-xs text-slate-700">
                <strong>Prazo:</strong> {result.deadlineInfo}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plain continuous text for copy */}
      {viewMode === 'plain' && (
        <div className="pt-5">
          <div className="bg-slate-50 border border-slate-300 rounded-xl p-5 font-sans leading-relaxed text-slate-800 whitespace-pre-wrap">
            {result.formattedText || `${result.summary}\n\nO que isso significa:\n${result.meaning}\n\nPróximos passos:\n${result.nextSteps.join('\n')}`}
          </div>
        </div>
      )}

      {/* Official Citizen Document Preview (Print Layout) */}
      <div className="hidden print:block print-only mt-8 border-t-2 border-slate-900 pt-6">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold">PODER JUDICIÁRIO DE RORAIMA</h2>
          <h3 className="text-sm font-semibold">TRIBUNAL DE JUSTIÇA DO ESTADO DE RORAIMA</h3>
          <p className="text-xs text-slate-600">Comunicado Oficial em Linguagem Simples (Pacto CNJ)</p>
        </div>

        <div className="space-y-4 text-sm leading-relaxed">
          <div>
            <strong>1. O que aconteceu no seu processo (Resumo):</strong>
            <p>{result.summary}</p>
          </div>
          <div>
            <strong>2. O que isso quer dizer:</strong>
            <p>{result.meaning}</p>
          </div>
          <div>
            <strong>3. Providências a serem tomadas (Próximos Passos):</strong>
            <ul>
              {result.nextSteps.map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
          <div>
            <strong>Prazos Legais:</strong> {result.deadlineInfo}
          </div>
          <div className="mt-8 pt-4 border-t border-slate-300 text-xs text-slate-500">
            TJRR • Central de Atendimento ao Cidadão • Balcão Virtual • Defensoria Pública (DPE-RR)
          </div>
        </div>
      </div>

      {/* User Feedback Controls (Polegares para cima/baixo - Requirement 2) */}
      <div className="mt-7 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-700">
            A explicação ficou clara e fácil de entender?
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleRate('up')}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentRating === 'up'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 border-slate-200'
              }`}
              title="A explicação está clara e compreensível"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Sim, bem claro</span>
            </button>

            <button
              onClick={() => handleRate('down')}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentRating === 'down'
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-slate-50 hover:bg-rose-50 text-slate-700 border-slate-200'
              }`}
              title="Ainda restou dúvida ou termo confuso"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>Ainda confuso</span>
            </button>
          </div>
        </div>

        {ratingSubmitted && (
          <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            Obrigado pelo seu feedback!
          </span>
        )}
      </div>

      {/* Modal for optional detailed feedback */}
      {showFeedbackModal && (
        <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in duration-150">
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            Gostaria de deixar uma sugestão para os servidores do TJRR sobre essa tradução? (Opcional)
          </label>
          <textarea
            rows={2}
            value={feedbackNotes}
            onChange={(e) => setFeedbackNotes(e.target.value)}
            placeholder="Exemplo: 'Faltou explicar onde fica o balcão virtual' ou 'Ficou excelente e rápido!'"
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setShowFeedbackModal(false)}
              className="px-3 py-1 text-xs text-slate-500 hover:text-slate-800"
            >
              Fechar
            </button>
            <button
              onClick={handleSubmitFeedbackDetails}
              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
            >
              Enviar Sugestão
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

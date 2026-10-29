import React from 'react';
import { 
  FileText, 
  Trash2, 
  ClipboardPaste, 
  ArrowRight, 
  Sliders, 
  Sparkles, 
  Loader2,
  ShieldCheck
} from 'lucide-react';

interface InputSectionProps {
  text: string;
  onChangeText: (text: string) => void;
  docType: string;
  onChangeDocType: (type: string) => void;
  temperature: number;
  onChangeTemperature: (temp: number) => void;
  onSubmit: () => void;
  isLoading: boolean;
  highContrast: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  text,
  onChangeText,
  docType,
  onChangeDocType,
  temperature,
  onChangeTemperature,
  onSubmit,
  isLoading,
  highContrast,
}) => {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        onChangeText(clipboardText);
      }
    } catch {
      // Clipboard permissions might be blocked, user can paste manually
    }
  };

  const handleClear = () => {
    onChangeText('');
  };

  const docTypes = [
    { id: 'geral', label: 'Geral / Qualquer Peça' },
    { id: 'despacho', label: 'Despacho' },
    { id: 'sentenca', label: 'Sentença' },
    { id: 'liminar', label: 'Decisão Liminar / Urgência' },
    { id: 'ementa', label: 'Ementa / Acórdão' },
    { id: 'intimacao', label: 'Intimação / Notificação' },
  ];

  return (
    <div className={`rounded-2xl border transition-all p-5 sm:p-6 shadow-sm ${
      highContrast 
        ? 'bg-black border-yellow-400 text-white' 
        : 'bg-white border-slate-200'
    }`}>
      {/* Title & Instructions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <FileText className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Área de Entrada do Documento Jurídico
            </h2>
            <p className="text-xs text-slate-500">
              Cole o trecho judicial emitido pelo TJRR ou outro órgão do Judiciário
            </p>
          </div>
        </div>

        {/* Action icons: Paste / Clear */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePaste}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 transition-colors"
            title="Colar texto da área de transferência"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-emerald-600" />
            <span>Colar</span>
          </button>

          {text && (
            <button
              type="button"
              onClick={handleClear}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 flex items-center gap-1.5 transition-colors"
              title="Limpar campo de texto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* Document Type Chips */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Tipo de Ato Judicial:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {docTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => onChangeDocType(type.id)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                docType === type.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          rows={7}
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Cole aqui o trecho da sentença, despacho, certidão de trânsito em julgado, ementa ou decisão judicial do TJRR...

Exemplo: 'Vistos. Cite-se o réu no prazo de 15 dias úteis, sob pena de revelia (art. 344 do CPC)...'"
          className={`w-full p-4 rounded-xl text-sm leading-relaxed border transition-all resize-y font-mono focus:outline-none focus:ring-2 ${
            highContrast
              ? 'bg-neutral-950 text-white border-yellow-400 focus:ring-yellow-400'
              : 'bg-slate-50 text-slate-800 border-slate-300 focus:ring-emerald-600 focus:bg-white'
          }`}
        />

        {/* Word/Char Counter */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 px-1">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Fidelidade Jurídica Garantida: Prazos e direitos são preservados</span>
          </div>
          <div>
            <span>{wordCount} palavras</span>
            <span className="mx-1">•</span>
            <span>{charCount} caracteres</span>
          </div>
        </div>
      </div>

      {/* Temperature & Parameters Control */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Precisão (Temperatura):</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => onChangeTemperature(0.2)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                temperature === 0.2
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="0.2 - Máxima fidelidade literal e estrita a prazos"
            >
              0.2 (Estrita)
            </button>
            <button
              type="button"
              onClick={() => onChangeTemperature(0.3)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                temperature === 0.3
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="0.3 - Equilibrada (Recomendada CNJ)"
            >
              0.3 (Recomendada)
            </button>
            <button
              type="button"
              onClick={() => onChangeTemperature(0.4)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                temperature === 0.4
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="0.4 - Mais didática e explicativa"
            >
              0.4 (Didática)
            </button>
          </div>
        </div>

        {/* Primary Action Button: Simplificar Texto */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !text.trim()}
          className={`min-w-[210px] px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 select-none shadow-md ${
            isLoading
              ? 'bg-emerald-800 text-white cursor-wait opacity-95 ring-2 ring-emerald-400'
              : !text.trim()
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-800/30 hover:shadow-lg active:scale-[0.98] ring-2 ring-emerald-600/30'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white shrink-0" />
              <span className="text-white font-bold">Traduzindo documento...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
              <span className="text-white font-bold">Simplificar Texto</span>
              <ArrowRight className="w-4 h-4 ml-0.5 text-white shrink-0" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { LEGAL_SAMPLES, LegalSample } from '../data/samples';
import { Sparkles, Check, Zap } from 'lucide-react';

interface SampleSelectorProps {
  onSelectSample: (sample: LegalSample, autoRun?: boolean) => void;
  selectedSampleId?: string;
  highContrast: boolean;
  isLoading?: boolean;
}

export const SampleSelector: React.FC<SampleSelectorProps> = ({
  onSelectSample,
  selectedSampleId,
  highContrast,
  isLoading
}) => {
  return (
    <div className={`rounded-2xl p-4 sm:p-5 border transition-all ${
      highContrast
        ? 'bg-black border-yellow-400 text-white'
        : 'bg-white/95 backdrop-blur border-slate-200 shadow-sm'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
            <Sparkles className="w-4 h-4 text-emerald-700" />
          </div>
          <h3 className="text-sm font-bold tracking-tight text-slate-900">
            Exemplos Reais do TJRR para Testar com 1 Clique
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Clique em qualquer peça abaixo para preencher e simplificar:
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {LEGAL_SAMPLES.map((sample) => {
          const isSelected = selectedSampleId === sample.id;
          return (
            <div
              key={sample.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between group ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/90 shadow-md ring-2 ring-emerald-500/50'
                  : highContrast
                  ? 'border-slate-800 hover:border-yellow-400 bg-neutral-900 text-white'
                  : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50 bg-white'
              }`}
            >
              <div 
                className="cursor-pointer"
                onClick={() => onSelectSample(sample, false)}
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    sample.category === 'Sentença'
                      ? 'bg-blue-100 text-blue-800'
                      : sample.category === 'Decisão Liminar'
                      ? 'bg-rose-100 text-rose-800'
                      : sample.category === 'Despacho'
                      ? 'bg-amber-100 text-amber-800'
                      : sample.category === 'Ementa'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {sample.category}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-200/80 px-1.5 py-0.5 rounded-full">
                      <Check className="w-3 h-3 text-emerald-800" />
                      Ativo
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1 group-hover:text-emerald-800">
                  {sample.title}
                </h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {sample.description}
                </p>
              </div>

              {/* Direct action button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => onSelectSample(sample, true)}
                  className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700'
                  }`}
                  title="Traduzir este exemplo diretamente"
                >
                  <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>Traduzir Agora</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Scale, Info, Sparkles, SunMoon, BookOpen, ExternalLink, X, FileText, CheckCircle2 } from 'lucide-react';
import { AccessibilityTextSize } from '../types';

interface NavbarProps {
  highContrast: boolean;
  onToggleHighContrast: () => void;
  textSize: AccessibilityTextSize;
  onChangeTextSize: (size: AccessibilityTextSize) => void;
  historyCount: number;
  onOpenHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  highContrast,
  onToggleHighContrast,
  textSize,
  onChangeTextSize,
  historyCount,
  onOpenHistory,
}) => {
  const [showPactModal, setShowPactModal] = useState(false);

  return (
    <>
      <header className={`border-b sticky top-0 z-40 transition-colors ${
        highContrast
          ? 'bg-black border-yellow-400 text-white'
          : 'bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-slate-800 text-white shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Titles */}
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg border border-emerald-400/30">
                <Scale className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold tracking-tight text-xl text-white">
                    Tradutor Cidadão
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2 py-0.5 rounded-full font-semibold">
                    TJRR
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span>Tribunal de Justiça de Roraima</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-amber-300 font-medium hidden sm:inline">Pacto Linguagem Simples CNJ</span>
                </div>
              </div>
            </div>

            {/* Accessibility Controls & Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Text Size Accessibility Controls */}
              <div className="hidden sm:flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700 text-xs">
                <span className="px-2 text-slate-400 font-medium select-none">Fonte:</span>
                <button
                  onClick={() => onChangeTextSize('sm')}
                  className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                    textSize === 'sm' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Tamanho pequeno"
                >
                  A-
                </button>
                <button
                  onClick={() => onChangeTextSize('md')}
                  className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                    textSize === 'md' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Tamanho normal"
                >
                  A
                </button>
                <button
                  onClick={() => onChangeTextSize('lg')}
                  className={`px-2 py-1 rounded text-sm font-bold transition-all ${
                    textSize === 'lg' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Tamanho grande"
                >
                  A+
                </button>
                <button
                  onClick={() => onChangeTextSize('xl')}
                  className={`px-2 py-1 rounded text-base font-bold transition-all ${
                    textSize === 'xl' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Tamanho extra grande"
                >
                  A++
                </button>
              </div>

              {/* High Contrast Toggle */}
              <button
                onClick={onToggleHighContrast}
                className={`p-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                  highContrast
                    ? 'bg-yellow-400 text-black border-yellow-300 font-bold'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                title="Alternar modo de alto contraste para acessibilidade visual"
              >
                <SunMoon className="w-4 h-4" />
                <span className="hidden md:inline">Contraste</span>
              </button>

              {/* History Button */}
              {historyCount > 0 && (
                <button
                  onClick={onOpenHistory}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Histórico</span>
                  <span className="bg-emerald-600 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                    {historyCount}
                  </span>
                </button>
              )}

              {/* Pact CNJ Info Modal Button */}
              <button
                onClick={() => setShowPactModal(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-1.5 shadow transition-all"
                title="Informações sobre o Pacto Nacional do Judiciário pela Linguagem Simples"
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">O Pacto CNJ</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Pacto CNJ Info Modal */}
      {showPactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 text-slate-800">
            <button
              onClick={() => setShowPactModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Pacto Nacional do Judiciário pela Linguagem Simples
                </h3>
                <p className="text-xs text-slate-500">
                  Conselho Nacional de Justiça (CNJ) • Tribunal de Justiça de Roraima (TJRR)
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-600 leading-relaxed max-h-[65vh] overflow-y-auto pr-2">
              <p>
                O <strong>Pacto Nacional do Judiciário pela Linguagem Simples</strong> foi instituído pelo CNJ com o objetivo de tornar a comunicação da Justiça mais acessível, direta e compreensível a todas as pessoas, eliminando termos técnicos excessivos, jargões arcaicos e expressões em latim.
              </p>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                <h4 className="font-semibold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Eixos de Atuação Adotados pelo Tradutor Cidadão:
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-emerald-950">
                  <li><strong>Linguagem Direta:</strong> Ordem direta das frases (sujeito + verbo + complemento), reduzindo frases intercaladas.</li>
                  <li><strong>Eliminação de Latim e Jargões:</strong> Tradução em linguagem didática do dia a dia.</li>
                  <li><strong>Fidelidade Jurídica Inviolável:</strong> Nenhuma obrigação legal, prazo ou direito pode ser omitido ou desvirtuado.</li>
                  <li><strong>Acessibilidade Universal:</strong> Recursos de leitura em voz alta, alto contraste e ajuste de fontes para idosos e pessoas com deficiência.</li>
                </ul>
              </div>

              <p className="text-xs text-slate-500 italic">
                Ferramenta oficial de apoio a servidores, magistrados, estagiários do TJRR e cidadãos em geral, alinhando a prestação jurisdicional à cidadania plena.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowPactModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Compreendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

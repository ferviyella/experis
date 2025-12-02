import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Copy, RefreshCw } from 'lucide-react';
import { AiProposalState } from '../types';

interface AiProposalProps {
  aiState: AiProposalState;
  onGenerate: () => void;
}

const AiProposal: React.FC<AiProposalProps> = ({ aiState, onGenerate }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-xl shadow-xl p-6 mt-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            Asistente de Ventas IA
            </h2>
            <button
                onClick={onGenerate}
                disabled={aiState.isLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${aiState.isLoading 
                    ? 'bg-indigo-800 text-indigo-300 cursor-not-allowed' 
                    : 'bg-white text-indigo-900 hover:bg-indigo-50 hover:shadow-lg active:scale-95'}`}
            >
                {aiState.isLoading ? (
                    <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generando...
                    </>
                ) : (
                    <>
                    <Sparkles className="w-4 h-4" />
                    {aiState.content ? 'Regenerar Propuesta' : 'Generar Propuesta'}
                    </>
                )}
            </button>
        </div>

        {aiState.error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg mb-4 text-sm">
                {aiState.error}
            </div>
        )}

        {aiState.content ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10 max-h-[500px] overflow-y-auto custom-scrollbar">
               <div className="prose prose-invert prose-sm max-w-none">
                 <ReactMarkdown>{aiState.content}</ReactMarkdown>
               </div>
               <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
                  <button 
                    onClick={() => navigator.clipboard.writeText(aiState.content!)}
                    className="text-xs text-indigo-200 hover:text-white flex items-center gap-1"
                  >
                      <Copy className="w-3 h-3" /> Copiar texto
                  </button>
               </div>
            </div>
        ) : (
            <div className="text-center py-12 text-indigo-200/60 border-2 border-dashed border-indigo-500/30 rounded-lg">
                <p>Haz clic en "Generar Propuesta" para crear un pitch de ventas personalizado basado en los cálculos actuales.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AiProposal;
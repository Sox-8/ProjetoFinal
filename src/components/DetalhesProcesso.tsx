import React from 'react';
import { ArrowLeft, Printer, Clock } from 'lucide-react';

interface Props {
  processo: any;
  setEcra: (ecra: string) => void;
}

export const DetalhesProcesso: React.FC<Props> = ({ processo, setEcra }) => {
  if (!processo) return null;

  return (
    <div className="animate-in zoom-in-95 p-6 max-w-4xl mx-auto">
      {/* Topo de Navegação */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => setEcra('procurar')} 
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Voltar
        </button>
        
        <button className="flex items-center gap-2 text-[#9a3412] hover:bg-orange-50 px-4 py-2 rounded-lg transition-colors font-medium">
          <Printer size={20} /> Imprimir Relatório
        </button>
      </div>

      {/* Cartão Principal */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#9a3412] p-6 text-white">
          <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded inline-block mb-2">
            {processo.tipo || 'Processo Judicial'}
          </span>
          <h1 className="text-3xl font-bold">{processo.natureza || 'Sem Natureza Definida'}</h1>
          <p className="opacity-90 mt-1 font-mono">Proc. Nº {processo.numeroProcesso}</p>
        </div>

        <div className="p-8">
            <div className="flex items-center gap-2 text-gray-500 mb-8 pb-4 border-b border-gray-100">
                <Clock size={18} />
                <span>Estado atual: <strong>{processo.estado || 'Em Curso'}</strong></span>
            </div>

            <p className="text-gray-600 leading-relaxed">
                Aqui apareceriam os detalhes completos, histórico de diligências e documentos associados a este processo.
            </p>
        </div>
      </div>
    </div>
  );
};
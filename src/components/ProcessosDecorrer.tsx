import React, { useEffect, useState } from 'react';
import { ArrowLeft, Gavel, Calendar, User, AlertCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface Props {
  setTela: (t: string) => void;
  onAbrirProcesso: (proc: any) => void; 
}

export const ProcessosDecorrer: React.FC<Props> = ({ setTela, onAbrirProcesso }) => {
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregarProcessos = async () => {
      try {
        const q = query(
          collection(db, "processos"),
          where("status", "==", "Ativo")
        );
        
        const querySnapshot = await getDocs(q);
        const dados = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setLista(dados);
      } catch (err: any) {
        console.error(err);
        setErro("Erro ao carregar processos.");
      }
      setLoading(false);
    };

    carregarProcessos();
  }, []);

  return (
    <div className="animate-in fade-in max-w-6xl mx-auto mt-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="bg-[#9a3412] text-white p-2 rounded-lg">
              <Gavel size={24} />
            </span>
            Processos em Curso
          </h2>
          <p className="text-gray-500 mt-1 ml-14">Visão geral de todos os casos ativos</p>
        </div>
        <button onClick={() => setTela('menu')} className="flex items-center gap-2 text-gray-600 hover:text-black border border-gray-300 px-4 py-2 rounded-lg bg-white transition-colors">
          <ArrowLeft size={18} /> Voltar
        </button>
      </div>

      {loading && (
        <div className="text-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-[#9a3412] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">A carregar processos...</p>
        </div>
      )}

      {erro && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3 mb-6">
          <AlertCircle size={20} /> {erro}
        </div>
      )}

      {!loading && !erro && lista.length === 0 && (
        <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-xl">
           <h3 className="text-lg font-bold text-gray-900">Sem processos ativos</h3>
           <p className="text-gray-500 mt-2 text-sm">Não existem processos em curso neste momento.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lista.map((proc) => (
          <div 
            key={proc.id} 
            onClick={() => onAbrirProcesso(proc)} 
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#9a3412] transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#9a3412] group-hover:w-2 transition-all"></div>

            <div className="flex justify-between items-start mb-4 pl-3">
              <span className="bg-orange-100 text-[#9a3412] text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                {proc.tipo || 'Geral'}
              </span>
              <span className="text-xs font-mono text-gray-400 font-medium">
                {proc.numeroProcesso}
              </span>
            </div>

            <div className="pl-3">
              <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1 group-hover:text-[#9a3412] transition-colors">
                {proc.natureza || 'Processo sem título'}
              </h3>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <User size={14} className="text-gray-400" />
                <span className="truncate">{proc.clienteNome || 'Cliente desconhecido'}</span>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center">
                 <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar size={14} />
                    {proc.dataAbertura?.seconds 
                      ? new Date(proc.dataAbertura.seconds * 1000).toLocaleDateString('pt-PT') 
                      : 'N/D'}
                 </div>
                 <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                   {proc.status}
                 </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
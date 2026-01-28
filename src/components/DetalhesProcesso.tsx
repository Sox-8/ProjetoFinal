import React, { useState, useEffect } from 'react';
import { ArrowLeft, Gavel, CheckCircle, Trash2, FileText, User, Send, Clock, Printer } from 'lucide-react';
import { db } from '../firebase';
import { doc, updateDoc, deleteDoc, collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';

interface Props {
  processo: any;
  setTela: (t: string) => void;
}

export const DetalhesProcesso: React.FC<Props> = ({ processo, setTela }) => {
  const [loading, setLoading] = useState(false);
  const [novaNota, setNovaNota] = useState('');
  const [historico, setHistorico] = useState<any[]>([]);
  const [loadingNotas, setLoadingNotas] = useState(true);

  useEffect(() => {
    carregarHistorico();
  }, [processo.id]);

  const carregarHistorico = async () => {
    try {
      const q = query(
        collection(db, "historico_processos"),
        where("processoId", "==", processo.id),
        orderBy("data", "desc")
      );
      const querySnapshot = await getDocs(q);
      const lista = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistorico(lista);
    } catch (error) {
      console.error("Erro ao ler histórico:", error);
    }
    setLoadingNotas(false);
  };

  const adicionarNota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaNota.trim()) return;

    try {
      await addDoc(collection(db, "historico_processos"), {
        processoId: processo.id,
        texto: novaNota,
        data: new Date(),
        autor: "Advogado"
      });
      setNovaNota('');
      carregarHistorico();
    } catch (error) {
      console.error(error);
      alert("Erro ao guardar nota.");
    }
  };

  const arquivarProcesso = async () => {
    if (!window.confirm("Tem a certeza que deseja dar este processo como CONCLUÍDO?")) return;
    setLoading(true);
    try {
      const docRef = doc(db, "processos", processo.id);
      await updateDoc(docRef, { status: 'Concluído', dataConclusao: new Date() });
      alert("Processo arquivado com sucesso.");
      setTela('menu');
    } catch (erro) {
      console.error(erro);
      alert("Erro ao arquivar.");
    }
    setLoading(false);
  };

  const apagarProcesso = async () => {
    if (!window.confirm("PERIGO: Isto vai apagar o processo permanentemente. Quer continuar?")) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "processos", processo.id));
      setTela('menu');
    } catch (erro) {
      console.error(erro);
      alert("Erro ao apagar.");
    }
    setLoading(false);
  };

  // Função simples para abrir a janela de impressão do navegador
  const imprimirRelatorio = () => {
    window.print();
  };

  return (
    <div className="animate-in fade-in max-w-6xl mx-auto mt-10 px-4 mb-20 print:mt-0 print:max-w-none">
      
      {/* Botões de Topo (Escondidos na Impressão) */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <button onClick={() => setTela('decorrer')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={20} /> Voltar à Lista
        </button>
        
        <button 
          onClick={imprimirRelatorio}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors"
        >
          <Printer size={18} /> Imprimir Relatório
        </button>
      </div>

      {/* Título visível APENAS na impressão */}
      <div className="hidden print:block mb-8 text-center border-b border-gray-900 pb-4">
        <h1 className="text-3xl font-bold text-black">Relatório de Processo</h1>
        <p className="text-sm text-gray-600">Ordem dos Advogados - Sistema de Gestão</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block">
        
        {/* --- COLUNA ESQUERDA: DETALHES (2/3) --- */}
        <div className="lg:col-span-2 space-y-6 print:mb-8">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden print:border-none print:shadow-none">
            
            <div className="bg-[#fff7ed] p-6 border-b border-[#fed7aa] flex justify-between items-start print:bg-white print:border-b-2 print:border-gray-200 print:px-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#9a3412] text-white rounded-full flex items-center justify-center shadow-sm print:hidden">
                  <Gavel size={24} />
                </div>
                <div>
                  <span className="bg-orange-100 text-[#9a3412] text-xs font-bold px-2 py-1 rounded uppercase tracking-wide print:border print:border-gray-300 print:text-black print:bg-transparent">
                    {processo.tipo}
                  </span>
                  <h2 className="text-xl font-bold text-[#9a3412] mt-1 print:text-black print:text-2xl">{processo.natureza}</h2>
                  <p className="text-[#9a3412]/70 font-mono text-xs print:text-gray-600">Ref: {processo.numeroProcesso}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200 print:border-black print:text-black print:bg-transparent">
                {processo.status}
              </span>
            </div>

            <div className="p-6 space-y-6 print:px-0">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2 print:text-black">
                  <FileText size={14} /> Descrição
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 text-sm leading-relaxed print:bg-transparent print:border-none print:p-0 print:text-black">
                  {processo.descricao || "Sem descrição disponível."}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg print:border-gray-300">
                  <span className="text-xs text-gray-400 block print:text-black">Tribunal</span>
                  <span className="font-semibold text-sm">{processo.tribunal || "-"}</span>
                </div>
                <div className="p-3 border rounded-lg print:border-gray-300">
                  <span className="text-xs text-gray-400 block print:text-black">Valor da Causa</span>
                  <span className="font-semibold text-sm">{processo.valorCausa ? `${processo.valorCausa} €` : "-"}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2 print:text-black">
                  <User size={14} /> Constituinte
                </h3>
                <div className="flex justify-between items-center bg-white border border-gray-200 p-3 rounded-lg print:border-none print:p-0">
                  <div>
                     <div className="font-bold text-gray-900">{processo.clienteNome}</div>
                     <div className="text-xs text-gray-500 font-mono">NIF: {processo.clienteNif}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Barra de Ações (ESCONDIDA AO IMPRIMIR) */}
            <div className="bg-gray-50 p-4 border-t border-gray-200 flex gap-3 print:hidden">
              <button onClick={arquivarProcesso} disabled={loading} className="flex-1 btn-registo-final bg-green-700 hover:bg-green-800 flex justify-center items-center gap-2 text-sm">
                <CheckCircle size={16} /> Concluir
              </button>
              <button onClick={apagarProcesso} disabled={loading} className="px-4 text-red-600 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors border border-transparent hover:border-red-200">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* --- COLUNA DIREITA: HISTÓRICO (1/3) --- */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm h-fit flex flex-col print:border-none print:shadow-none print:h-auto print:block">
          <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl print:bg-transparent print:px-0 print:border-b-2 print:border-black">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Clock size={18} className="text-[#9a3412] print:hidden" /> Histórico & Diligências
            </h3>
          </div>

          {/* Removemos o max-height na impressão para sair TUDO */}
          <div className="p-4 max-h-[400px] overflow-y-auto space-y-4 print:max-h-none print:overflow-visible print:px-0">
            {loadingNotas ? (
               <p className="text-center text-xs text-gray-400 py-4">A carregar...</p>
            ) : historico.length === 0 ? (
               <div className="text-center py-8 text-gray-400 text-sm italic">
                 Nenhuma nota registada neste processo.
               </div>
            ) : (
               historico.map((nota) => (
                 <div key={nota.id} className="relative pl-4 border-l-2 border-gray-200 pb-2 last:pb-0 print:border-l-4 print:border-gray-300">
                   {/* Bolinha */}
                   <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#9a3412] print:bg-black print:-left-[6px]"></div>
                   
                   <p className="text-xs text-gray-400 font-mono mb-1 print:text-black print:font-bold">
                     {nota.data?.seconds ? new Date(nota.data.seconds * 1000).toLocaleDateString('pt-PT') : 'Hoje'}
                   </p>
                   <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 print:bg-transparent print:border-none print:p-0 print:text-black">
                     {nota.texto}
                   </div>
                 </div>
               ))
            )}
          </div>

          {/* Formulário (ESCONDIDO AO IMPRIMIR) */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl print:hidden">
            <form onSubmit={adicionarNota}>
              <div className="relative">
                <textarea 
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#9a3412] focus:border-transparent outline-none resize-none pr-10"
                  rows={2}
                  placeholder="Escreva uma nova diligência..."
                  value={novaNota}
                  onChange={e => setNovaNota(e.target.value)}
                ></textarea>
                <button 
                  type="submit" 
                  disabled={!novaNota.trim()}
                  className="absolute right-2 bottom-2 text-[#9a3412] hover:bg-orange-100 p-1 rounded-md transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
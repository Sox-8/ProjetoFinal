import React, { useState } from 'react';
import { Search, User, Hash, Gavel, Calendar, AlertCircle, Edit2 } from 'lucide-react'; // <--- Edit2 importado
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface Props {
  setTela: (t: string) => void;
  onNovoCaso: (cliente: any) => void;
  onEditarCliente: (cliente: any) => void; // <--- NOVA PROPRIEDADE
}

export const ProcurarCliente: React.FC<Props> = ({ onNovoCaso, onEditarCliente }) => {
  const [tipoPesquisa, setTipoPesquisa] = useState<'nif' | 'processo'>('nif');
  const [valorBusca, setValorBusca] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [cliente, setCliente] = useState<any>(null);
  const [processos, setProcessos] = useState<any[]>([]);
  const [erro, setErro] = useState('');

  const pesquisar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valorBusca) return;
    
    setLoading(true);
    setErro('');
    setCliente(null);
    setProcessos([]);

    try {
      const qCliente = query(collection(db, "clientes"), where("nif", "==", valorBusca));
      const querySnapshot = await getDocs(qCliente);

      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        const clienteEncontrado = { id: querySnapshot.docs[0].id, ...docData };
        setCliente(clienteEncontrado);

        const qProcessos = query(
          collection(db, "processos"), 
          where("clienteId", "==", clienteEncontrado.id)
        );
        const procSnapshot = await getDocs(qProcessos);
        
        const listaProcessos = procSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setProcessos(listaProcessos);

      } else {
        setErro("Nenhum cliente encontrado com este NIF.");
      }
    } catch (error) {
      console.error(error);
      setErro("Erro ao conectar à base de dados.");
    }
    setLoading(false);
  };

  const limparPesquisa = () => {
    setValorBusca('');
    setCliente(null);
    setProcessos([]);
    setErro('');
  };

  return (
    <div className="animate-in fade-in search-page-grid">
      
      {/* COLUNA ESQUERDA: FORMULÁRIO */}
      <div className="panel-card">
        <div className="search-header-row">
          <div className="icon-circle-brown">
            <Search size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 m-0">Procurar</h2>
            <p className="text-sm text-gray-500 m-0">Pesquisa de arquivo</p>
          </div>
        </div>

        <form onSubmit={pesquisar} className="flex flex-col h-full">
          <div className="search-options-list">
            <div 
              className={`option-card ${tipoPesquisa === 'nif' ? 'active' : ''}`}
              onClick={() => setTipoPesquisa('nif')}
            >
              <div className="option-icon"><Hash size={20} /></div>
              <div>
                <span className="block text-sm font-bold text-gray-900">NIF</span>
                <span className="block text-xs text-gray-500">Contribuinte</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="search-type-label">NIF do Cliente</label>
            <input 
              type="text" 
              className="input-legal" 
              placeholder="Ex: 123456789"
              value={valorBusca}
              onChange={(e) => setValorBusca(e.target.value)}
              maxLength={9}
            />
          </div>

          <div className="mt-auto space-y-3">
             {erro && (
               <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded text-sm font-medium">
                 <AlertCircle size={16} /> {erro}
               </div>
             )}
             
             <button type="submit" disabled={loading} className="btn-search-submit" style={{ backgroundColor: '#9a3412' }}>
               {loading ? "A procurar..." : "Pesquisar Cliente"}
             </button>
             
             <button type="button" onClick={limparPesquisa} className="btn-clear-outline">
               Limpar Pesquisa
             </button>
          </div>
        </form>
      </div>

      {/* COLUNA DIREITA: RESULTADOS */}
      <div className="panel-card">
        
        {!cliente ? (
          <div className="empty-state-container">
            <div className="empty-icon-circle">
              <User size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Ficha do Cliente</h3>
            <p className="max-w-xs mx-auto text-sm">
              Os detalhes do cliente e os seus processos aparecerão aqui após a pesquisa.
            </p>
          </div>
        ) : (
          <div className="animate-in zoom-in-95 flex flex-col h-full overflow-y-auto">
            
            {/* Cabeçalho Ficha */}
            <div className="details-header">
              <div className="icon-user-large">
                {cliente.fotoPreview ? (
                   <img src={cliente.fotoPreview} alt="Foto" className="w-full h-full object-cover rounded-full" />
                ) : (
                   <User size={36} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 m-0 flex items-center gap-2">
                        {cliente.nome}
                        {/* BOTÃO EDITAR */}
                        <button onClick={() => onEditarCliente(cliente)} className="text-gray-400 hover:text-blue-600 transition-colors" title="Editar dados">
                            <Edit2 size={16} />
                        </button>
                    </h2>
                    <p className="text-sm text-gray-500 m-0">{cliente.email || 'Sem email'}</p>
                  </div>
                  <button onClick={() => onNovoCaso(cliente)} className="btn-view-processes text-sm py-2 px-4">
                    + Novo Processo
                  </button>
                </div>
              </div>
            </div>

            <div className="divider-line" style={{ marginTop: 0 }}></div>

            <div className="details-grid mb-8">
              <div className="detail-item">
                <span className="detail-label">NIF</span>
                <span className="detail-value">{cliente.nif}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Telefone</span>
                <span className="detail-value">{cliente.telefone || "-"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Morada</span>
                <span className="detail-value">{cliente.endereco || "-"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Cidade</span>
                <span className="detail-value">{cliente.cidade || "-"}</span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Gavel size={20} className="text-[#9a3412]" /> Processos em Curso
            </h3>

            {processos.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 text-sm">
                Este cliente ainda não tem processos registados.
              </div>
            ) : (
              <div className="space-y-3">
                {processos.map((proc) => (
                  <div key={proc.id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded">
                        {proc.tipo || 'Geral'}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        {proc.numeroProcesso}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900">
                      {proc.natureza || 'Sem Título'}
                    </h4>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 border-t border-gray-100 pt-2">
                      <Calendar size={12} /> Aberto em: {proc.dataAbertura?.toDate().toLocaleDateString('pt-PT') || 'Data desc.'}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
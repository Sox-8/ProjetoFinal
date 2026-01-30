import React, { useState } from 'react';
import { Search, Hash, FileText, ArrowLeft, Scale, AlertCircle, User, Calendar, Edit2, Trash2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../style.css'; 

interface Props {
  setEcra: (ecra: string) => void;
  onNovoCaso: (cliente: any) => void;
  onEditarCliente: (cliente: any) => void;
  onVerProcesso: (processo: any) => void;
}

export const ProcurarCliente: React.FC<Props> = ({ setEcra, onNovoCaso, onEditarCliente, onVerProcesso }) => {
  // --- LÓGICA (Mantida igual) ---
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
      // 1. Pesquisa por NIF
      if (tipoPesquisa === 'nif') {
        const qCliente = query(collection(db, "clientes"), where("nif", "==", valorBusca));
        const querySnapshot = await getDocs(qCliente);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          const clienteEncontrado = { id: querySnapshot.docs[0].id, ...docData };
          setCliente(clienteEncontrado);

          const qProcessos = query(collection(db, "processos"), where("clienteId", "==", clienteEncontrado.id));
          const procSnapshot = await getDocs(qProcessos);
          setProcessos(procSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else {
          setErro("Nenhum cliente encontrado com este NIF.");
        }
      } 
      // 2. Pesquisa por Processo (Lógica Extra se precisares)
      else {
        const qProc = query(collection(db, "processos"), where("numeroProcesso", "==", valorBusca));
        const procSnap = await getDocs(qProc);
        if(!procSnap.empty) {
             // Lógica inversa: Encontrar o processo -> Encontrar o cliente (Simplificado aqui)
             setErro("Funcionalidade de pesquisa direta por processo em desenvolvimento.");
        } else {
             setErro("Processo não encontrado.");
        }
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
    <div className="page-container">
      
      {/* HEADER (Igual ao Registo) */}
      <header className="header-bar with-action">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="logo-circle">
                <Scale size={24} />
            </div>
            <div className="header-title">
                <h1>Ordem dos Advogados</h1>
                <p>Sistema de Gestão de Processos</p>
            </div>
        </div>
        <button onClick={() => setEcra('menu')} className="btn-back">
            <ArrowLeft size={16} /> Voltar
        </button>
      </header>

      {/* GRELHA PRINCIPAL DA PESQUISA */}
      <div className="search-page-grid">
        
        {/* COLUNA DA ESQUERDA: FORMULÁRIO */}
        <div className="search-panel">
            
            <div className="search-panel-header">
                <div className="icon-circle-brown">
                    <Search size={24} />
                </div>
                <div>
                    <h2 className="font-bold text-lg text-gray-900 leading-tight">Procurar Cliente</h2>
                    <p className="text-xs text-gray-500">Pesquise por NIF ou processo</p>
                </div>
            </div>

            <form onSubmit={pesquisar}>
                <p className="text-sm font-medium text-gray-700 mb-3">Tipo de Pesquisa</p>
                
                {/* Opção 1: NIF */}
                <div 
                    className={`search-option-card ${tipoPesquisa === 'nif' ? 'active' : ''}`}
                    onClick={() => setTipoPesquisa('nif')}
                >
                    <Hash size={20} className="option-icon" />
                    <div>
                        <span className="option-title">NIF</span>
                        <span className="option-subtitle">Número de Identificação Fiscal</span>
                    </div>
                </div>

                {/* Opção 2: Nº Processo */}
                <div 
                    className={`search-option-card ${tipoPesquisa === 'processo' ? 'active' : ''}`}
                    onClick={() => setTipoPesquisa('processo')}
                >
                    <FileText size={20} className="option-icon" />
                    <div>
                        <span className="option-title">Nº Processo</span>
                        <span className="option-subtitle">Número do processo</span>
                    </div>
                </div>

                <div className="mt-6 mb-6">
                    <label className="form-label">
                        {tipoPesquisa === 'nif' ? 'Número de Identificação Fiscal' : 'Número do Processo'}
                    </label>
                    <input 
                        type="text" 
                        className="form-input" 
                        placeholder={tipoPesquisa === 'nif' ? '123456789' : 'Ex: 2024/001'}
                        value={valorBusca}
                        onChange={(e) => setValorBusca(e.target.value)}
                        maxLength={tipoPesquisa === 'nif' ? 9 : 20}
                    />
                </div>

                {erro && (
                    <div className="error-message mb-4">
                        <AlertCircle size={16} /> {erro}
                    </div>
                )}

                <button type="submit" disabled={loading} className="btn-beige">
                    {loading ? "A procurar..." : "Procurar"}
                </button>
                
                <button type="button" onClick={limparPesquisa} className="btn-outline">
                    Limpar
                </button>
            </form>
        </div>

        {/* COLUNA DA DIREITA: RESULTADOS ou VAZIO */}
        <div className="search-panel">
            
            {!cliente ? (
                /* ESTADO VAZIO (Igual à imagem) */
                <div className="empty-state">
                    <div className="empty-state-icon-large">
                        <Search size={40} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Nenhuma pesquisa realizada</h3>
                    <p className="text-sm text-gray-500 max-w-xs">
                        Utilize o formulário à esquerda para procurar um cliente por NIF ou número de processo.
                    </p>
                </div>
            ) : (
                /* RESULTADOS ENCONTRADOS */
                <div className="animate-in fade-in h-full flex flex-col">
                    <div className="result-header">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                <User size={40} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{cliente.nome}</h2>
                                <p className="text-gray-500 text-sm">{cliente.email}</p>
                                <div className="flex gap-4 mt-1 text-xs text-gray-400">
                                    <span>NIF: {cliente.nif}</span>
                                    <span>Tel: {cliente.telefone || '-'}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => onEditarCliente(cliente)} className="text-gray-400 hover:text-[#9a3412]">
                            <Edit2 size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Scale size={18} /> Processos Associados
                            </h3>
                            <button onClick={() => onNovoCaso(cliente)} className="text-xs font-bold text-[#9a3412] hover:underline">
                                + Novo Processo
                            </button>
                        </div>

                        {processos.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                Este cliente não tem processos registados.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {processos.map(proc => (
                                    <div key={proc.id} onClick={() => onVerProcesso(proc)} className="process-card-mini">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-xs font-bold text-[#9a3412] bg-orange-50 px-2 py-0.5 rounded">
                                                {proc.tipo || 'Geral'}
                                            </span>
                                            <span className="text-xs text-gray-400 font-mono">{proc.numeroProcesso}</span>
                                        </div>
                                        <div className="font-bold text-gray-800 text-sm">{proc.natureza}</div>
                                        <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                            <Calendar size={12} /> {proc.dataAbertura?.toDate().toLocaleDateString('pt-PT')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};
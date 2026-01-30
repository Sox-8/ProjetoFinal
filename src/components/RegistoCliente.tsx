import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Scale, AlertCircle, Save, CheckCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import '../style.css'; 

interface Props {
  setEcra: (ecra: string) => void;
  clienteInicial?: any;
}

export const RegistoCliente: React.FC<Props> = ({ setEcra }) => {
  // --- ESTADOS ---
  const [etapa, setEtapa] = useState<'verificacao' | 'formulario'>('verificacao');
  
  // Estado Passo 1 (Verificação)
  const [nifVerificacao, setNifVerificacao] = useState('');
  const [loadingVerificacao, setLoadingVerificacao] = useState(false);
  const [erroVerificacao, setErroVerificacao] = useState('');

  // Estado Passo 2 (Formulário)
  const [nome, setNome] = useState('');
  const [nif, setNif] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [morada, setMorada] = useState('');
  const [loadingGuardar, setLoadingGuardar] = useState(false);

  // --- FUNÇÕES ---
  const verificarNif = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nifVerificacao || nifVerificacao.length !== 9) {
      setErroVerificacao("O NIF deve ter exatamente 9 dígitos.");
      return;
    }

    setLoadingVerificacao(true);
    setErroVerificacao('');

    try {
      const q = query(collection(db, "clientes"), where("nif", "==", nifVerificacao));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setErroVerificacao("Erro: Este NIF já se encontra registado no sistema.");
      } else {
        setNif(nifVerificacao);
        setEtapa('formulario');
      }
    } catch (error) {
      console.error(error);
      setErroVerificacao("Erro de conexão ao verificar NIF.");
    }
    setLoadingVerificacao(false);
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingGuardar(true);

    try {
      await addDoc(collection(db, "clientes"), {
        nome,
        nif,
        email,
        telefone,
        morada,
        dataRegisto: Timestamp.now()
      });
      alert("Cliente registado com sucesso!");
      setEcra('procurar');
    } catch (error) {
      console.error(error);
      alert("Erro ao gravar dados.");
    }
    setLoadingGuardar(false);
  };

  // --- RENDERIZAÇÃO ---

  return (
    <div className="page-container">
      
      {/* HEADER (Igual à imagem: Logo à esquerda, Voltar à direita) */}
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
        
        {/* Botão Voltar */}
        <button onClick={() => setEcra('menu')} className="btn-back">
            <ArrowLeft size={16} /> Voltar
        </button>
      </header>

      {/* PASSO 1: VERIFICAÇÃO NIF (Design da Imagem) */}
      {etapa === 'verificacao' && (
        <div className="register-container">
            <div className="register-card">
                
                <div className="icon-user-register">
                    <UserPlus size={32} />
                </div>

                <h2 className="register-title">Registar Novo Cliente</h2>
                <p className="register-subtitle">
                    Insira o número de identificação fiscal para verificar se o cliente já está registado
                </p>

                <form onSubmit={verificarNif}>
                    <div className="form-group">
                        <label className="form-label">Número de Identificação Fiscal (NIF)</label>
                        <input 
                            type="text" 
                            className="form-input"
                            placeholder="123456789"
                            maxLength={9}
                            value={nifVerificacao}
                            onChange={(e) => setNifVerificacao(e.target.value)}
                        />
                        <p className="input-helper">O NIF deve ter 9 dígitos</p>
                    </div>

                    {erroVerificacao && (
                        <div className="error-message">
                            <AlertCircle size={16} /> {erroVerificacao}
                        </div>
                    )}

                    <button type="submit" className="btn-primary-full" disabled={loadingVerificacao}>
                        {loadingVerificacao ? "A verificar..." : "Verificar e Continuar"}
                    </button>
                </form>

                <div className="info-box">
                    <h4 className="info-title">Informação</h4>
                    <p className="info-text">
                        Se o número de identificação fiscal já existir no sistema, não será possível criar um novo registo. Cada cliente só pode ser registado uma vez.
                    </p>
                </div>

            </div>
        </div>
      )}

      {/* PASSO 2: FORMULÁRIO FINAL (Mantendo o estilo limpo) */}
      {etapa === 'formulario' && (
        <div className="register-container">
            <div className="register-card" style={{ maxWidth: '800px', textAlign: 'left' }}>
                
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="icon-user-register" style={{ margin: 0, width: '3rem', height: '3rem' }}>
                        <UserPlus size={20} />
                    </div>
                    <div>
                        <h2 className="register-title" style={{ fontSize: '1.25rem', marginBottom: 0 }}>Ficha de Cliente</h2>
                        <div className="flex items-center gap-2 text-green-600 text-sm mt-1">
                            <CheckCircle size={14} /> NIF {nif} validado
                        </div>
                    </div>
                </div>

                <form onSubmit={guardar} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="form-label">Nome Completo</label>
                        <input 
                            type="text" className="form-input" required
                            value={nome} onChange={e => setNome(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="form-label">Email</label>
                        <input 
                            type="email" className="form-input"
                            value={email} onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="form-label">Telefone</label>
                        <input 
                            type="tel" className="form-input"
                            value={telefone} onChange={e => setTelefone(e.target.value)}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="form-label">Morada / Localidade</label>
                        <input 
                            type="text" className="form-input"
                            value={morada} onChange={e => setMorada(e.target.value)}
                        />
                    </div>

                    <div className="col-span-2 flex gap-4 mt-4">
                        <button 
                            type="button" 
                            onClick={() => setEtapa('verificacao')}
                            className="btn-primary-full"
                            style={{ backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db' }}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="btn-primary-full" disabled={loadingGuardar}>
                            {loadingGuardar ? "A gravar..." : "Gravar Ficha"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};
import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Scale, AlertCircle, Save, CheckCircle, Upload } from 'lucide-react';
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
  
  // Estado Passo 1
  const [nifVerificacao, setNifVerificacao] = useState('');
  const [loadingVerificacao, setLoadingVerificacao] = useState(false);
  const [erroVerificacao, setErroVerificacao] = useState('');

  // Estado Passo 2
  const [nome, setNome] = useState('');
  const [nif, setNif] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [nacionalidade, setNacionalidade] = useState('Portuguesa');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [morada, setMorada] = useState('');
  const [codPostal, setCodPostal] = useState('');
  const [cidade, setCidade] = useState('');
  
  // NOVO: Estado para a foto
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const [loadingGuardar, setLoadingGuardar] = useState(false);

  // --- FUNÇÕES ---
  
  // NOVO: Função para ler a foto selecionada
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Cria um leitor de ficheiros para converter a imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string); // Guarda a imagem como texto (Base64) para preview
      };
      reader.readAsDataURL(file);
    }
  };

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
        dataNascimento,
        nacionalidade,
        email,
        telefone,
        morada,
        codPostal,
        cidade,
        fotoPreview, // NOVO: Grava a foto na base de dados
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
      
      {/* HEADER */}
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

      {/* PASSO 1: VERIFICAÇÃO NIF */}
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
                            type="text" className="form-input"
                            placeholder="123456789" maxLength={9}
                            value={nifVerificacao} onChange={(e) => setNifVerificacao(e.target.value)}
                        />
                    </div>
                    {erroVerificacao && (
                        <div className="error-message"><AlertCircle size={16} /> {erroVerificacao}</div>
                    )}
                    <button type="submit" className="btn-primary-full" disabled={loadingVerificacao}>
                        {loadingVerificacao ? "A verificar..." : "Verificar e Continuar"}
                    </button>
                </form>

                <div className="info-box">
                    <h4 className="info-title">Informação</h4>
                    <p className="info-text">
                        Se o número de identificação fiscal já existir no sistema, não será possível criar um novo registo.
                    </p>
                </div>
            </div>
        </div>
      )}

      {/* PASSO 2: FORMULÁRIO DETALHADO */}
      {etapa === 'formulario' && (
        <div className="register-container">
            <div className="register-card wide">
                
                <form onSubmit={guardar}>
                    {/* TOPO: Ícone, Título e Foto */}
                    <div className="form-header-layout">
                        <div className="flex gap-4">
                            <div className="icon-user-register" style={{ margin: 0 }}>
                                <UserPlus size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Dados do Cliente</h2>
                                <p className="text-sm text-gray-500">Preencha todos os campos para completar o registo</p>
                            </div>
                        </div>

                        {/* Área de Upload de Foto */}
                        <div className="photo-upload-container">
                            {/* Input invisível para selecionar o ficheiro */}
                            <input 
                                type="file" 
                                id="fotoInput" 
                                accept="image/*" 
                                onChange={handleFotoChange} 
                                style={{ display: 'none' }} 
                            />

                            <div className="photo-placeholder">
                                {fotoPreview ? (
                                    // Se existir foto, mostra a imagem
                                    <img src={fotoPreview} alt="Preview" />
                                ) : (
                                    // Se não, mostra o ícone de upload
                                    <Upload size={24} />
                                )}
                            </div>
                            
                            {/* Botão que ativa o input invisível */}
                            <button 
                                type="button" 
                                className="btn-small-outline"
                                onClick={() => document.getElementById('fotoInput')?.click()}
                            >
                                {fotoPreview ? "Alterar Foto" : "Adicionar Foto"}
                            </button>
                            <span className="text-[10px] text-gray-400">Opcional</span>
                        </div>
                    </div>

                    {/* SECÇÃO 1: IDENTIFICAÇÃO */}
                    <h3 className="form-section-title">Identificação</h3>
                    <div className="form-grid">
                        <div className="col-span-2">
                            <label className="form-label">Nome Completo *</label>
                            <input 
                                type="text" className="form-input" required
                                value={nome} onChange={e => setNome(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="form-label">NIF *</label>
                            <input 
                                type="text" className="form-input bg-gray-100 text-gray-500" readOnly
                                value={nif} 
                            />
                        </div>
                        <div>
                            <label className="form-label">Data de Nascimento</label>
                            <input 
                                type="date" className="form-input"
                                value={dataNascimento} onChange={e => setDataNascimento(e.target.value)}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="form-label">Nacionalidade</label>
                            <input 
                                type="text" className="form-input"
                                value={nacionalidade} onChange={e => setNacionalidade(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* SECÇÃO 2: CONTACTOS */}
                    <h3 className="form-section-title">Contactos</h3>
                    <div className="form-grid">
                        <div>
                            <label className="form-label">Email *</label>
                            <input 
                                type="email" className="form-input" required
                                value={email} onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="form-label">Telefone *</label>
                            <input 
                                type="tel" className="form-input" required
                                value={telefone} onChange={e => setTelefone(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* SECÇÃO 3: MORADA */}
                    <h3 className="form-section-title">Morada</h3>
                    <div className="form-grid">
                        <div className="col-span-2">
                            <label className="form-label">Endereço *</label>
                            <input 
                                type="text" className="form-input" placeholder="Rua, nº, andar..." required
                                value={morada} onChange={e => setMorada(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="form-label">Código Postal</label>
                            <input 
                                type="text" className="form-input" placeholder="0000-000"
                                value={codPostal} onChange={e => setCodPostal(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="form-label">Cidade</label>
                            <input 
                                type="text" className="form-input"
                                value={cidade} onChange={e => setCidade(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* BOTÕES DE AÇÃO */}
                    <div className="form-actions-row">
                        <button 
                            type="button" 
                            onClick={() => setEtapa('verificacao')}
                            className="btn-cancel"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={loadingGuardar}
                            className="btn-primary-full" 
                            style={{ flex: 1, marginTop: 0 }}
                        >
                            {loadingGuardar ? "A gravar..." : "Registar Cliente"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
      )}

    </div>
  );
};
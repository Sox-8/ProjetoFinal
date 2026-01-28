import React, { useState, useRef } from 'react';
import { UserPlus, Upload } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

interface Props {
  setTela: (t: string) => void;
}

export const RegistoCliente: React.FC<Props> = ({ setTela }) => {
  const [formData, setFormData] = useState({
    nome: '', nif: '', dataNasc: '', nacionalidade: 'Portuguesa',
    email: '', telefone: '', endereco: '', cp: '', cidade: ''
  });

  const [loading, setLoading] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função chamada ao escolher um ficheiro
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const abrirSeletor = () => {
    fileInputRef.current?.click();
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome) return alert("O Nome Completo é obrigatório.");
    
    setLoading(true);

    try {
      await addDoc(collection(db, "clientes"), {
        ...formData,
        fotoPreview: fotoPreview,
        dataRegisto: new Date()
      });

      alert("Cliente registado com sucesso.");
      setTela('menu');

    } catch (erro: any) {
      console.error("Erro Firebase:", erro);
      alert("Erro ao guardar: " + erro.message);
    }

    setLoading(false);
  };

  return (
    <div className="container-registo animate-in fade-in">
      <div className="card-registo-compacto">
        
        {/* Input Invisível para o ficheiro */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          style={{ display: 'none' }} 
        />

        {/* Cabeçalho */}
        <div className="flex justify-between items-start mb-10">
          <div className="flex gap-4">
            <div className="menu-icon-wrapper" style={{ margin: 0, width: 52, height: 52, backgroundColor: '#8b4513' }}>
              <UserPlus size={24} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-bold m-0" style={{ color: '#111' }}>Dados do Cliente</h2>
              <p className="text-sm text-muted-foreground m-0">Novo registo de constituinte</p>
            </div>
          </div>

          {/* Área de Upload */}
          <div className="photo-upload-container">
            <div className="photo-dashed-circle" onClick={abrirSeletor}>
              {fotoPreview ? (
                <img src={fotoPreview} alt="Preview" className="avatar-img-cover" />
              ) : (
                <Upload size={32} strokeWidth={1.5} />
              )}
            </div>
            <button type="button" onClick={abrirSeletor} className="btn-upload-trigger">
              <Upload size={16} /> Adicionar Foto
            </button>
            <span className="text-[10px] text-gray-400 uppercase tracking-wide font-bold mt-1">Opcional</span>
          </div>
        </div>

        <form onSubmit={handleSalvar} className="space-y-8">
          
          {/* Identificação */}
          <div className="form-section border-none mt-0 pt-0">
            <h3 className="form-section-title">Identificação</h3>
            <div className="space-y-5">
              <div className="input-group">
                <label className="input-label-required">Nome Completo</label>
                <input required className="input-legal" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
              </div>
              <div className="form-grid-3">
                <div className="input-group"><label className="input-label-required">NIF</label><input required className="input-legal" maxLength={9} value={formData.nif} onChange={e => setFormData({...formData, nif: e.target.value})} /></div>
                <div className="input-group"><label className="input-label-required">Data de Nascimento</label><input type="date" className="input-legal" onChange={e => setFormData({...formData, dataNasc: e.target.value})} /></div>
                <div className="input-group"><label className="input-label-required">Nacionalidade</label><input className="input-legal" value={formData.nacionalidade} onChange={e => setFormData({...formData, nacionalidade: e.target.value})} /></div>
              </div>
            </div>
          </div>

          {/* Contactos */}
          <div className="form-section">
            <h3 className="form-section-title">Contactos</h3>
            <div className="form-grid-2">
              <div className="input-group"><label className="input-label-required">Email</label><input type="email" className="input-legal" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
              <div className="input-group"><label className="input-label-required">Telefone</label><input className="input-legal" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} /></div>
            </div>
          </div>

          {/* Morada */}
          <div className="form-section">
            <h3 className="form-section-title">Morada</h3>
            <div className="space-y-5">
              <div className="input-group"><label className="input-label-required">Endereço</label><input className="input-legal" value={formData.endereco} onChange={e => setFormData({...formData, endereco: e.target.value})} /></div>
              <div className="form-grid-2">
                <div className="input-group"><label className="input-label-required">Código Postal</label><input className="input-legal" value={formData.cp} onChange={e => setFormData({...formData, cp: e.target.value})} /></div>
                <div className="input-group"><label className="input-label-required">Cidade</label><input className="input-legal" value={formData.cidade} onChange={e => setFormData({...formData, cidade: e.target.value})} /></div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 mt-10">
            <button type="button" onClick={() => setTela('menu')} className="btn-cancelar-light flex-1">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-registo-final flex-1">
                {loading ? "A guardar..." : "Registar Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
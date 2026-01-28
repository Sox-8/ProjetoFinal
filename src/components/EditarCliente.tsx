import React, { useState } from 'react';
import { Save, ArrowLeft, UserCog } from 'lucide-react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface Props {
  cliente: any;
  setTela: (t: string) => void;
}

export const EditarCliente: React.FC<Props> = ({ cliente, setTela }) => {
  // Inicializa o formulário com os dados que já existem
  const [formData, setFormData] = useState({
    nome: cliente.nome || '',
    nif: cliente.nif || '',
    dataNasc: cliente.dataNasc || '',
    nacionalidade: cliente.nacionalidade || '',
    email: cliente.email || '',
    telefone: cliente.telefone || '',
    endereco: cliente.endereco || '',
    cp: cliente.cp || '',
    cidade: cliente.cidade || ''
  });

  const [loading, setLoading] = useState(false);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Atualiza apenas os campos alterados no documento existente
      const clienteRef = doc(db, "clientes", cliente.id);
      await updateDoc(clienteRef, formData);

      alert("Dados do cliente atualizados com sucesso.");
      setTela('procurar'); // Volta para a pesquisa para veres as mudanças
    } catch (erro: any) {
      console.error("Erro:", erro);
      alert("Erro ao atualizar: " + erro.message);
    }

    setLoading(false);
  };

  return (
    <div className="container-registo animate-in fade-in">
      <div className="card-registo-compacto">
        
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
           <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
             <UserCog size={24} />
           </div>
           <div>
             <h2 className="text-xl font-bold text-gray-900 m-0">Editar Cliente</h2>
             <p className="text-sm text-gray-500 m-0">Corrigir dados da ficha</p>
           </div>
        </div>

        <form onSubmit={handleSalvar} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="input-group">
              <label className="input-label-required">Nome Completo</label>
              <input required className="input-legal" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
            </div>
            <div className="input-group">
              <label className="input-label-required">NIF</label>
              <input required className="input-legal" maxLength={9} value={formData.nif} onChange={e => setFormData({...formData, nif: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="input-group"><label className="input-label-required">Data Nasc.</label><input type="date" className="input-legal" value={formData.dataNasc} onChange={e => setFormData({...formData, dataNasc: e.target.value})} /></div>
            <div className="input-group"><label className="input-label-required">Nacionalidade</label><input className="input-legal" value={formData.nacionalidade} onChange={e => setFormData({...formData, nacionalidade: e.target.value})} /></div>
            <div className="input-group"><label className="input-label-required">Telefone</label><input className="input-legal" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} /></div>
          </div>

          <div className="input-group"><label className="input-label-required">Email</label><input type="email" className="input-legal" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>

          <div className="form-section pt-4 border-t border-gray-100">
            <h3 className="form-section-title mb-4">Morada</h3>
            <div className="space-y-4">
              <div className="input-group"><input className="input-legal" placeholder="Rua..." value={formData.endereco} onChange={e => setFormData({...formData, endereco: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="input-group"><input className="input-legal" placeholder="Código Postal" value={formData.cp} onChange={e => setFormData({...formData, cp: e.target.value})} /></div>
                <div className="input-group"><input className="input-legal" placeholder="Cidade" value={formData.cidade} onChange={e => setFormData({...formData, cidade: e.target.value})} /></div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setTela('procurar')} className="btn-cancelar-light flex-1 flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-registo-final flex-1 bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2">
                <Save size={16} /> {loading ? "A guardar..." : "Guardar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
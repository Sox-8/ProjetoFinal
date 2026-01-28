import React, { useState } from 'react';
import { Gavel, Save, ArrowLeft } from 'lucide-react';
import { db } from '../firebase'; // Aqui o ../firebase JÁ VAI FUNCIONAR!
import { collection, addDoc } from 'firebase/firestore';

interface Props {
  cliente: any;
  setTela: (t: string) => void;
}

export const CriarProcesso: React.FC<Props> = ({ cliente, setTela }) => {
  const [dados, setDados] = useState({
    tipo: 'Civil',
    natureza: '',
    tribunal: '',
    numeroProcesso: '',
    valorCausa: '',
    descricao: ''
  });

  const [loading, setLoading] = useState(false);

  const submeter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dados.natureza || !dados.numeroProcesso) {
      alert("Por favor preencha os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "processos"), {
        ...dados,
        clienteId: cliente.id,
        clienteNome: cliente.nome,
        clienteNif: cliente.nif,
        status: 'Ativo',
        dataAbertura: new Date()
      });

      alert("Processo criado com sucesso.");
      setTela('menu');

    } catch (erro: any) {
      console.error("Erro:", erro);
      alert("Erro ao criar processo: " + erro.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="animate-in fade-in max-w-4xl mx-auto mt-10">
      <button onClick={() => setTela('menu')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft size={20} /> Voltar ao Menu
      </button>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-[#fff7ed] p-8 border-b border-[#fed7aa]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#9a3412] text-white rounded-full flex items-center justify-center">
              <Gavel size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#9a3412]">Novo Processo Judicial</h2>
              <p className="text-[#9a3412]/70">Abertura de nova pasta jurídica</p>
            </div>
          </div>
          
          <div className="bg-white/60 p-4 rounded-lg border border-[#9a3412]/10 flex justify-between items-center">
             <div>
               <span className="text-xs font-bold uppercase text-gray-500">Constituinte</span>
               <p className="font-bold text-gray-900 text-lg">{cliente.nome}</p>
             </div>
             <div className="text-right">
               <span className="text-xs font-bold uppercase text-gray-500">NIF</span>
               <p className="font-mono text-gray-900">{cliente.nif}</p>
             </div>
          </div>
        </div>

        <form onSubmit={submeter} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="input-group">
              <label className="input-label-required">Número do Processo</label>
              <input type="text" placeholder="Ex: 1245/26.9T8PRT" className="input-legal" value={dados.numeroProcesso} onChange={e => setDados({...dados, numeroProcesso: e.target.value})} />
            </div>
            <div className="input-group">
              <label className="input-label-required">Área Jurídica</label>
              <select className="input-legal" value={dados.tipo} onChange={e => setDados({...dados, tipo: e.target.value})}>
                <option value="Civil">Civil</option>
                <option value="Penal">Penal</option>
                <option value="Laboral">Laboral</option>
                <option value="Comercial">Comercial</option>
                <option value="Administrativo">Administrativo</option>
                <option value="Familia">Família e Menores</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="input-group">
              <label className="input-label-required">Natureza / Ação</label>
              <input type="text" placeholder="Ex: Divórcio Litigioso..." className="input-legal" value={dados.natureza} onChange={e => setDados({...dados, natureza: e.target.value})} />
            </div>
            <div className="input-group">
              <label className="text-sm font-semibold text-gray-700">Tribunal / Instância</label>
              <input type="text" className="input-legal" value={dados.tribunal} onChange={e => setDados({...dados, tribunal: e.target.value})} />
            </div>
          </div>

          <div className="input-group">
            <label className="text-sm font-semibold text-gray-700">Valor da Causa (€)</label>
            <input type="number" className="input-legal" placeholder="0.00" value={dados.valorCausa} onChange={e => setDados({...dados, valorCausa: e.target.value})} />
          </div>

          <div className="input-group">
            <label className="text-sm font-semibold text-gray-700">Descrição / Notas Iniciais</label>
            <textarea rows={4} className="input-legal" placeholder="Resumo breve do caso..." value={dados.descricao} onChange={e => setDados({...dados, descricao: e.target.value})}></textarea>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
            <button type="button" onClick={() => setTela('menu')} className="btn-cancelar-light">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-registo-final flex items-center gap-2">
              <Save size={18} /> {loading ? "A criar..." : "Abrir Processo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
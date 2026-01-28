import { useState } from 'react';
import { Sparkles, FileText, Save, ArrowLeft } from 'lucide-react';
import { db } from '../firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface Props {
  cliente: { id: string, nome: string, nif: string };
  setTela: (t: string) => void;
  aoSucesso: () => void;
}

export const CriarCaso: React.FC<Props> = ({ cliente, setTela, aoSucesso }) => {
  const [carregando, setCarregando] = useState(false);
  const [tipoCaso, setTipoCaso] = useState('');
  const [tribunal, setTribunal] = useState('');
  const [respostas, setRespostas] = useState<any>({});

  const configuracaoCasos: any = {
    'despejo': {
      nome: 'Ação de Despejo (Rendas)',
      fundamentacao: 'Art. 1083.º do Código Civil - Resolução por falta de pagamento.',
      perguntas: [
        { id: 'valor_renda', label: 'Valor da Renda Mensal (€)', type: 'number' },
        { id: 'meses_falta', label: 'Meses em Atraso', type: 'text' },
        { id: 'factos', label: 'Descrição dos Incumprimentos', type: 'textarea' }
      ]
    },
    'divorcio': {
      nome: 'Divórcio por Mútuo Consentimento',
      fundamentacao: 'Art. 1775.º do Código Civil - Regime de mútuo consentimento.',
      perguntas: [
        { id: 'data_separacao', label: 'Data da Separação de Facto', type: 'date' },
        { id: 'filhos_menores', label: 'Relação de Filhos Menores', type: 'textarea' }
      ]
    }
  };

  const salvarProcesso = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    const numProcesso = `${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}.ADS`;

    try {
      await addDoc(collection(db, "processos"), {
        clienteId: cliente.id,
        numero: numProcesso,
        tipo: configuracaoCasos[tipoCaso].nome,
        tribunal: tribunal,
        detalhes: respostas, 
        dataCriacao: serverTimestamp()
      });
      alert("Processo autuado com sucesso!");
      aoSucesso();
    } catch (err) {
      alert("Erro ao gravar dados.");
    }
    setCarregando(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 animate-in fade-in">
      <button onClick={() => setTela('procurar_arquivo')} className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft size={14} /> Voltar à Pasta
      </button>

      <div className="card-juridico p-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="icon-circle-large m-0"><Sparkles size={28} /></div>
          <div>
            <h2 className="text-xl font-bold">Assistente de Articulados</h2>
            <p className="text-sm text-muted-foreground">Constituinte: <strong>{cliente.nome}</strong></p>
          </div>
        </div>

        <form onSubmit={salvarProcesso} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="info-label">Natureza da Causa</label>
              <select 
                required className="input-legal"
                value={tipoCaso}
                onChange={(e) => { setTipoCaso(e.target.value); setRespostas({}); }}
              >
                <option value="">Selecione o modelo...</option>
                {Object.keys(configuracaoCasos).map(k => (
                  <option key={k} value={k}>{configuracaoCasos[k].nome}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="info-label">Tribunal Alvo</label>
              <input 
                required className="input-legal" placeholder="Ex: Comarca do Porto"
                value={tribunal} onChange={(e) => setTribunal(e.target.value)}
              />
            </div>
          </div>

          {tipoCaso && (
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-6 animate-in">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Base Legal: {configuracaoCasos[tipoCaso].fundamentacao}</p>
              
              <div className="grid grid-cols-1 gap-6">
                {configuracaoCasos[tipoCaso].perguntas.map((p: any) => (
                  <div key={p.id} className="space-y-2">
                    <label className="info-label">{p.label}</label>
                    {p.type === 'textarea' ? (
                      <textarea required className="input-legal" rows={3} onChange={(e) => setRespostas({...respostas, [p.id]: e.target.value})} />
                    ) : (
                      <input required type={p.type} className="input-legal" onChange={(e) => setRespostas({...respostas, [p.id]: e.target.value})} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-orange-50/50 rounded-lg text-[#8b4513]">
            <FileText size={18} />
            <span className="text-xs font-medium">Os dados serão utilizados para gerar o rascunho da Petição Inicial em PDF.</span>
          </div>

          <button type="submit" disabled={!tipoCaso || carregando} className="btn-adicionar-processo w-full py-4 text-lg">
            <Save size={20} /> {carregando ? "A processar..." : "Gravar e Gerar Peditório"}
          </button>
        </form>
      </div>
    </div>
  );
};
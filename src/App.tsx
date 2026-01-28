import React, { useState } from 'react';
import { Scale } from 'lucide-react';
import { MenuPrincipal } from './components/MenuPrincipal';
import { RegistoCliente } from './components/RegistoCliente';
import { ProcurarCliente } from './components/ProcurarCliente';
import { CriarProcesso } from './components/CriarProcesso';
import { ProcessosDecorrer } from './components/ProcessosDecorrer';
import { ProcessosArquivados } from './components/ProcessosArquivados';
import { DetalhesProcesso } from './components/DetalhesProcesso';
import { EditarCliente } from './components/EditarCliente'; // <--- IMPORTAR NOVO

function App() {
  const [tela, setTela] = useState('menu');
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [processoSelecionado, setProcessoSelecionado] = useState<any>(null);

  const iniciarNovoProcesso = (cliente: any) => {
    setClienteSelecionado(cliente);
    setTela('criar-processo');
  };

  const abrirProcesso = (processo: any) => {
    setProcessoSelecionado(processo);
    setTela('detalhes-processo');
  };

  // NOVA FUNÇÃO: Editar Cliente
  const editarCliente = (cliente: any) => {
    setClienteSelecionado(cliente);
    setTela('editar-cliente');
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#8b4513] rounded-full flex items-center justify-center text-white">
               <Scale size={20} strokeWidth={2.5} />
             </div>
             <div>
               <h1 className="text-xl font-bold text-gray-900 leading-none">Ordem dos Advogados</h1>
               <p className="text-xs text-gray-500 mt-1">Sistema de Gestão de Processos</p>
             </div>
          </div>
          {tela !== 'menu' && (
             <button onClick={() => setTela('menu')} className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
               ← Voltar ao Menu
             </button>
          )}
        </div>
      </header>

      <main>
        {tela === 'menu' && <MenuPrincipal setTela={setTela} />}
        {tela === 'registo' && <RegistoCliente setTela={setTela} />}
        
        {tela === 'procurar' && (
          <ProcurarCliente 
            setTela={setTela} 
            onNovoCaso={iniciarNovoProcesso}
            onEditarCliente={editarCliente} // <--- PASSAR A FUNÇÃO
          />
        )}

        {tela === 'criar-processo' && clienteSelecionado && (
          <CriarProcesso cliente={clienteSelecionado} setTela={setTela} />
        )}

        {tela === 'decorrer' && (
          <ProcessosDecorrer setTela={setTela} onAbrirProcesso={abrirProcesso} />
        )}

        {tela === 'arquivo' && (
          <ProcessosArquivados setTela={setTela} onAbrirProcesso={abrirProcesso} />
        )}

        {tela === 'detalhes-processo' && processoSelecionado && (
          <DetalhesProcesso processo={processoSelecionado} setTela={setTela} />
        )}

        {/* --- ECRÃ DE EDIÇÃO --- */}
        {tela === 'editar-cliente' && clienteSelecionado && (
           <EditarCliente cliente={clienteSelecionado} setTela={setTela} />
        )}
      </main>
    </div>
  );
}

export default App;
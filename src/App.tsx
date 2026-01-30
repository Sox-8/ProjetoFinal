import React, { useState } from 'react';
import { MenuPrincipal } from './components/MenuPrincipal';
import { ProcurarCliente } from './components/ProcurarCliente';
import { RegistoCliente } from './components/RegistoCliente';
import { DetalhesProcesso } from './components/DetalhesProcesso';

function App() {
  const [ecra, setEcra] = useState('menu'); 
  
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
  const [processoSelecionado, setProcessoSelecionado] = useState<any>(null);

  const irParaNovoCaso = (cliente: any) => {
    setClienteSelecionado(cliente);
    setEcra('novo-caso');
  };

  const irParaEditar = (cliente: any) => {
    setClienteSelecionado(cliente);
    setEcra('editar-cliente'); 
  };

  const verDetalhes = (processo: any) => {
    setProcessoSelecionado(processo);
    setEcra('detalhes');
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {ecra === 'menu' && (
        <MenuPrincipal setEcra={setEcra} />
      )}

      {ecra === 'procurar' && (
        <ProcurarCliente 
          setEcra={setEcra} 
          onNovoCaso={irParaNovoCaso}
          onEditarCliente={irParaEditar}
          onVerProcesso={verDetalhes}
        />
      )}

      {ecra === 'novo-caso' && (
        <RegistoCliente 
          setEcra={setEcra} 
          clienteInicial={clienteSelecionado}
        />
      )}

      {ecra === 'detalhes' && (
        <DetalhesProcesso 
          setEcra={setEcra}
          processo={processoSelecionado}
        />
      )}

    </div>
  );
}

export default App;
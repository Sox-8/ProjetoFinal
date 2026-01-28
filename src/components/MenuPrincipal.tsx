import React from 'react';
import { UserPlus, Search, Folder, FolderCheck } from 'lucide-react';

interface Props {
  setTela: (t: string) => void;
}

export const MenuPrincipal: React.FC<Props> = ({ setTela }) => {
  return (
    <div className="text-center animate-in fade-in duration-700 py-10">
      <h2 className="text-2xl font-bold mb-2 text-[#3f2e22]">Bem-vindo</h2>
      <p className="text-muted-foreground mb-12">Selecione uma opção para continuar</p>
      
      <div className="menu-grid">
        
        {/* 1. REGISTAR CLIENTE */}
        <div className="menu-item-custom group" onClick={() => setTela('registo')}>
          <div className="menu-icon-wrapper group-hover:scale-110 transition-transform">
            <UserPlus size={30} />
          </div>
          <h3 className="font-bold text-gray-900 mt-4">Registar Cliente</h3>
          <p className="text-sm text-muted-foreground mt-2">Adicione um novo cliente ao sistema</p>
        </div>

        {/* 2. PROCURAR CLIENTE */}
        <div className="menu-item-custom group" onClick={() => setTela('procurar')}>
          <div className="menu-icon-wrapper group-hover:scale-110 transition-transform">
            <Search size={30} />
          </div>
          <h3 className="font-bold text-gray-900 mt-4">Procurar Cliente</h3>
          <p className="text-sm text-muted-foreground mt-2">Pesquise clientes registados</p>
        </div>

        {/* 3. PROCESSOS A DECORRER */}
        <div className="menu-item-custom group" onClick={() => setTela('decorrer')}>
          <div className="menu-icon-wrapper group-hover:scale-110 transition-transform">
            <Folder size={30} />
          </div>
          <h3 className="font-bold text-gray-900 mt-4">Processos a Decorrer</h3>
          <p className="text-sm text-muted-foreground mt-2">Consulte processos ativos</p>
        </div>

        {/* 4. PROCESSOS FECHADOS (DESBLOQUEADO) */}
        <div className="menu-item-custom group" onClick={() => setTela('arquivo')}>
          <div className="menu-icon-wrapper group-hover:scale-110 transition-transform bg-gray-700">
            <FolderCheck size={30} />
          </div>
          <h3 className="font-bold text-gray-900 mt-4">Processos Fechados</h3>
          <p className="text-sm text-muted-foreground mt-2">Aceda ao arquivo de processos</p>
        </div>

      </div>
    </div>
  );
};
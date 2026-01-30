import React from 'react';
import { Scale, Search, UserPlus, FolderOpen, FolderCheck, LogOut } from 'lucide-react';
import '../style.css'; // Garante que o estilo é carregado

interface Props {
  setEcra: (ecra: string) => void;
}

export const MenuPrincipal: React.FC<Props> = ({ setEcra }) => {
  return (
    <div className="page-container">
      
      {/* HEADER: Logótipo e Título à esquerda */}
      <header className="header-bar">
        <div className="logo-circle">
          <Scale size={24} />
        </div>
        <div className="header-title">
          <h1>Ordem dos Advogados</h1>
          <p>Sistema de Gestão de Processos</p>
        </div>
      </header>

      {/* CONTEÚDO CENTRAL: Bem-vindo e Cartões */}
      <main className="main-content">
        
        <div className="welcome-text">
          <h2>Bem-vindo</h2>
          <p>Selecione uma opção para continuar</p>
        </div>

        <div className="menu-grid">
          
          {/* BOTÃO 1: REGISTAR */}
          <button onClick={() => setEcra('novo-caso')} className="menu-card">
            {/* Esta div 'card-icon' é que faz a bola castanha! */}
            <div className="card-icon">
              <UserPlus size={32} />
            </div>
            <h3>Registar Cliente</h3>
            <p>Adicione um novo cliente ao sistema</p>
          </button>

          {/* BOTÃO 2: PROCURAR */}
          <button onClick={() => setEcra('procurar')} className="menu-card">
            <div className="card-icon">
              <Search size={32} />
            </div>
            <h3>Procurar Cliente</h3>
            <p>Pesquise clientes registados</p>
          </button>

          {/* BOTÃO 3: DECORRER */}
          <button onClick={() => setEcra('decorrer')} className="menu-card">
            <div className="card-icon">
              <FolderOpen size={32} />
            </div>
            <h3>Processos a Decorrer</h3>
            <p>Consulte processos ativos</p>
          </button>

          {/* BOTÃO 4: FECHADOS */}
          <button onClick={() => setEcra('arquivados')} className="menu-card">
            <div className="card-icon">
              <FolderCheck size={32} />
            </div>
            <h3>Processos Fechados</h3>
            <p>Aceda ao arquivo de processos</p>
          </button>

        </div>
      </main>

      {/* FOOTER: Rodapé alinhado */}
      <footer className="footer-bar">
        <span>© 2026 Ordem dos Advogados</span>
        <button className="btn-logout">
          Terminar Sessão <LogOut size={14} />
        </button>
      </footer>
    </div>
  );
};
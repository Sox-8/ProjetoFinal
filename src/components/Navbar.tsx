import React from 'react';
import { LogOut, LayoutGrid } from 'lucide-react';

interface Props {
  tela: string;
  setTela: (t: string) => void;
}

export const Navbar: React.FC<Props> = ({ tela, setTela }) => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Lado Esquerdo: Título mais pequeno (text-lg) */}
        <div 
          className="flex items-center cursor-pointer hover:opacity-70 transition-opacity" 
          onClick={() => setTela('menu')}
          title="Voltar ao Menu Principal"
        >
          <h1 className="text-lg font-bold text-gray-800 m-0 tracking-tight">
            Ordem dos Advogados
          </h1>
        </div>

        {/* Lado Direito: Botões de Ação */}
        <div className="flex items-center gap-6">
          {tela !== 'menu' && (
            <button 
              onClick={() => setTela('menu')}
              className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#9a3412] transition-colors"
            >
              <LayoutGrid size={18} />
              <span className="hidden sm:inline">Menu Principal</span>
            </button>
          )}

          <div className="h-6 w-px bg-gray-200"></div>

          <button 
            onClick={() => alert("A sair...")}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { ArrowLeft, User, MapPin, Phone, Mail, Calendar, Flag, Hash, Scale } from 'lucide-react';
import '../style.css';

interface Props {
  setEcra: (ecra: string) => void;
  cliente: any;
}

export const FichaCliente: React.FC<Props> = ({ setEcra, cliente }) => {
  if (!cliente) return null;

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
        <button onClick={() => setEcra('procurar')} className="btn-back">
            <ArrowLeft size={16} /> Voltar
        </button>
      </header>

      <div className="register-container">
        <div className="register-card wide">
            
            {/* CABEÇALHO DA FICHA (Foto e Nome) */}
            <div className="form-header-layout">
                <div className="flex gap-6 items-center">
                    {/* Foto Grande */}
                    {cliente.fotoPreview ? (
                        <img 
                            src={cliente.fotoPreview} 
                            alt="Cliente" 
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center text-gray-300">
                            <User size={64} />
                        </div>
                    )}
                    
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">{cliente.nome}</h1>
                        <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-1 rounded-full w-fit border border-gray-200">
                            <Hash size={14} />
                            <span className="font-mono text-sm">NIF: {cliente.nif}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* GRELHA DE DADOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                
                {/* Coluna 1: Dados Pessoais */}
                <div>
                    <h3 className="form-section-title flex items-center gap-2">
                        <User size={18} /> Dados Pessoais
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Nacionalidade</span>
                            <div className="flex items-center gap-2 text-gray-700">
                                <Flag size={16} /> {cliente.nacionalidade || 'Não definida'}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Data de Nascimento</span>
                            <div className="flex items-center gap-2 text-gray-700">
                                <Calendar size={16} /> {cliente.dataNascimento || 'Não definida'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coluna 2: Contactos */}
                <div>
                    <h3 className="form-section-title flex items-center gap-2">
                        <Phone size={18} /> Contactos
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Email</span>
                            <div className="flex items-center gap-2 text-gray-700">
                                <Mail size={16} /> {cliente.email}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Telefone</span>
                            <div className="flex items-center gap-2 text-gray-700">
                                <Phone size={16} /> {cliente.telefone}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coluna Completa: Morada */}
                <div className="md:col-span-2">
                    <h3 className="form-section-title flex items-center gap-2">
                        <MapPin size={18} /> Morada
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                        <div>
                            <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Endereço</span>
                            <span className="text-gray-700 font-medium">{cliente.morada}</span>
                        </div>
                        <div className="flex gap-8">
                            <div>
                                <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Localidade</span>
                                <span className="text-gray-700">{cliente.cidade || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Código Postal</span>
                                <span className="text-gray-700 font-mono">{cliente.codPostal || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
      </div>
    </div>
  );
};
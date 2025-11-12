

import React, { useState } from 'react';
import { SunIcon, MoonIcon } from './icons/Icons';

interface LoginScreenProps {
  onLogin: (name: string, membershipNumber: string) => void;
  onLoginAsGuest: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavigateToRegister: () => void;
  logoUrl: string | null;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onLoginAsGuest, theme, onToggleTheme, onNavigateToRegister, logoUrl }) => {
  const [name, setName] = useState('');
  const [membershipNumber, setMembershipNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && membershipNumber.trim()) {
      onLogin(name.trim(), membershipNumber.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-main-bg-light dark:bg-main-bg-dark text-gray-800 dark:text-gray-200 p-4">
        <div className="absolute top-4 right-4">
            <button 
              onClick={onToggleTheme} 
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 bg-white/20 dark:bg-gray-900/20 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Mudar tema"
            >
              {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>
        </div>
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
           {logoUrl && (
            <img src={logoUrl} alt="Logo" className="mx-auto h-20 w-auto mb-4 object-contain" />
          )}
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Futebol RC
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Acesso exclusivo para sócios do Rádio Clube.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-md relative block w-full px-4 py-4 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-sidebar-bg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-lg"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="membership-number" className="sr-only">
                Senha (Nº de título)
              </label>
              <input
                id="membership-number"
                name="membership"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-4 py-4 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-sidebar-bg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-lg"
                placeholder="Senha (Nº de título)"
                value={membershipNumber}
                onChange={(e) => setMembershipNumber(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-light transition-all transform hover:scale-105"
            >
              Acessar
            </button>
          </div>
        </form>
         <div className="text-sm text-center">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToRegister(); }} className="font-medium text-brand-blue hover:text-brand-blue-dark dark:hover:text-brand-blue-light">
              Ainda não tem conta? Cadastre-se
            </a>
        </div>
        <div className="relative flex items-center justify-center my-2">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-main-bg-light dark:bg-main-bg-dark text-gray-500 dark:text-gray-400">
              ou
            </span>
          </div>
        </div>
        <div>
            <button
              type="button"
              onClick={onLoginAsGuest}
              className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 text-lg font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-sidebar-bg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-light transition-all"
            >
              Entrar como Convidado
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
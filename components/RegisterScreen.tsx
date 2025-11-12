import React, { useState } from 'react';
import { User } from '../types';
import { SunIcon, MoonIcon } from './icons/Icons';

type NewUserData = Omit<User, 'id' | 'avatarUrl' | 'role' | 'goals' | 'status'>;

interface RegisterScreenProps {
  onRegister: (userData: NewUserData) => void;
  onNavigateToLogin: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, onNavigateToLogin, theme, onToggleTheme }) => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [membershipNumber, setMembershipNumber] = useState('');
  const [position, setPosition] = useState<'Goleiro' | 'Zagueiro' | 'Lateral' | 'Meio-campo' | 'Atacante'>('Atacante');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && nickname.trim() && email.trim() && membershipNumber.trim()) {
      onRegister({ name: name.trim(), nickname: nickname.trim(), email: email.trim(), membershipNumber: membershipNumber.trim(), position });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-main-bg-light dark:bg-main-bg-dark text-gray-800 dark:text-gray-200 p-4">
        <div className="absolute top-4 right-4">
             <button onClick={onToggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 bg-white/20 dark:bg-gray-900/20 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Mudar tema">
              {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>
        </div>
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Criar Conta
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Seu cadastro será enviado para aprovação do administrador.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <input id="name" name="name" type="text" required className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-sidebar-bg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue" placeholder="Nome Completo" value={name} onChange={(e) => setName(e.target.value)} />
            <input id="nickname" name="nickname" type="text" required className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-sidebar-bg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue" placeholder="Apelido" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            <input id="email" name="email" type="email" required className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-sidebar-bg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
            <select id="position" value={position} onChange={(e) => setPosition(e.target.value as any)} className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-sidebar-bg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue">
                <option>Atacante</option>
                <option>Meio-campo</option>
                <option>Zagueiro</option>
                <option>Lateral</option>
                <option>Goleiro</option>
            </select>
            <input id="membership-number" name="membership" type="password" required className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-sidebar-bg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue" placeholder="Nº de título" value={membershipNumber} onChange={(e) => setMembershipNumber(e.target.value)} />
          </div>
          <div>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-light transition-all transform hover:scale-105">
              Cadastrar
            </button>
          </div>
        </form>
         <div className="text-sm text-center">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToLogin(); }} className="font-medium text-brand-blue hover:text-brand-blue-dark dark:hover:text-brand-blue-light">
              Já tem uma conta? Faça o login
            </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;

import React from 'react';
import { Championship, User, View } from '../types';
import { CalendarIcon, ClockIcon, PencilIcon, TrashIcon, ArrowLeftIcon, UsersIcon } from './icons/Icons';

const getStatusInfo = (status: Championship['status']) => {
  switch (status) {
    case 'upcoming': return { text: 'Em Breve', color: 'bg-blue-500' };
    case 'ongoing': return { text: 'Em Andamento', color: 'bg-green-500' };
    case 'finished': return { text: 'Finalizado', color: 'bg-gray-500' };
    default: return { text: 'Status', color: 'bg-gray-400' };
  }
};

interface ChampionshipDetailsScreenProps {
  championship: Championship;
  currentUser: User;
  onNavigate: (view: View, id?: string) => void;
  onDelete: (id: string) => void;
}

const ChampionshipDetailsScreen: React.FC<ChampionshipDetailsScreenProps> = ({ championship, currentUser, onNavigate, onDelete }) => {
  const statusInfo = getStatusInfo(championship.status);

  return (
    <div className="animate-reveal max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => onNavigate('championships')}
          className="flex items-center text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue-light transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Voltar para Campeonatos
        </button>
        {currentUser.role === 'admin' && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('championshipForm', championship.id)}
              className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors shadow-sm"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Editar
            </button>
            <button
              onClick={() => onDelete(championship.id)}
              className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Excluir
            </button>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-sidebar-bg p-8 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{championship.name}</h1>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <span>{championship.date}</span>
              <ClockIcon className="w-4 h-4 ml-4 mr-2" />
              <span>{championship.time}</span>
            </div>
          </div>
          <span className={`text-sm font-bold text-white px-3 py-1.5 rounded-full ${statusInfo.color} self-start`}>
            {statusInfo.text}
          </span>
        </div>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-xl font-bold">Descrição</h2>
          <p>{championship.description}</p>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
           <h2 className="text-xl font-bold mb-4 flex items-center">
            <UsersIcon className="w-6 h-6 mr-3 text-brand-blue" />
            Times e Jogadores
          </h2>
          <div className="text-center bg-gray-100 dark:bg-gray-800/50 p-8 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Funcionalidade de gerenciamento de times e jogadores em breve.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChampionshipDetailsScreen;

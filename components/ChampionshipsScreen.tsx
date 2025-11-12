
import React from 'react';
import { Championship, User, View } from '../types';
import ChampionshipCard from './ChampionshipCard';
import { PlusIcon, TrophyIcon } from './icons/Icons';

interface ChampionshipsScreenProps {
  championships: Championship[];
  currentUser: User;
  onNavigate: (view: View, id?: string) => void;
}

const ChampionshipsScreen: React.FC<ChampionshipsScreenProps> = ({ championships, currentUser, onNavigate }) => {
  const upcomingChampionships = championships.filter(c => c.status === 'upcoming' || c.status === 'ongoing');
  const finishedChampionships = championships.filter(c => c.status === 'finished');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Campeonatos</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Acompanhe os torneios do clube.</p>
        </div>
        {currentUser.role === 'admin' && (
          <button 
            onClick={() => onNavigate('championshipForm')}
            className="flex items-center justify-center px-5 py-3 bg-brand-blue text-white font-semibold rounded-lg shadow-md hover:bg-brand-blue-dark transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Novo Campeonato
          </button>
        )}
      </div>

      {upcomingChampionships.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Próximos e em Andamento</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingChampionships.map(champ => (
              <ChampionshipCard key={champ.id} championship={champ} onViewDetails={(id) => onNavigate('championshipDetails', id)} />
            ))}
          </div>
        </div>
      )}

      {finishedChampionships.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Finalizados</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {finishedChampionships.map(champ => (
              <ChampionshipCard key={champ.id} championship={champ} onViewDetails={(id) => onNavigate('championshipDetails', id)} />
            ))}
          </div>
        </div>
      )}

      {championships.length === 0 && (
        <div className="text-center bg-white dark:bg-sidebar-bg p-12 rounded-2xl">
          <TrophyIcon className="w-16 h-16 mx-auto text-gray-400" />
          <h3 className="mt-4 text-xl font-bold">Nenhum campeonato agendado</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {currentUser.role === 'admin' ? 'Clique em "Novo Campeonato" para criar o primeiro.' : 'Aguarde o administrador agendar os próximos campeonatos.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChampionshipsScreen;
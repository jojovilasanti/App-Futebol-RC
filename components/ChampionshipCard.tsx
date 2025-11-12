
import React from 'react';
import { Championship } from '../types';
import { CalendarIcon, ClockIcon, TrophyIcon } from './icons/Icons';

interface ChampionshipCardProps {
  championship: Championship;
  onViewDetails: (id: string) => void;
}

const ChampionshipCard: React.FC<ChampionshipCardProps> = ({ championship, onViewDetails }) => {
  const getStatusInfo = () => {
    switch (championship.status) {
      case 'upcoming':
        return { text: 'Em Breve', color: 'bg-blue-500' };
      case 'ongoing':
        return { text: 'Em Andamento', color: 'bg-green-500' };
      case 'finished':
        return { text: 'Finalizado', color: 'bg-gray-500' };
      default:
        return { text: 'Status', color: 'bg-gray-400' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between transition-transform transform hover:scale-105 border border-transparent hover:border-brand-blue dark:border-gray-700 dark:hover:border-brand-blue-light animate-reveal">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{championship.name}</h3>
          <span className={`text-xs font-bold text-white px-2.5 py-1 rounded-full ${statusInfo.color}`}>
            {statusInfo.text}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 h-20 overflow-hidden">{championship.description}</p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span>Início em: {championship.date}</span>
          <ClockIcon className="w-4 h-4 ml-4 mr-2" />
          <span>às {championship.time}</span>
        </div>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700/50">
        <button
          onClick={() => onViewDetails(championship.id)}
          className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-brand-blue hover:bg-brand-blue-dark rounded-lg transition-transform transform hover:scale-105"
        >
          <TrophyIcon className="w-5 h-5 mr-2" />
          Ver Detalhes
        </button>
      </div>
    </div>
  );
};

export default ChampionshipCard;

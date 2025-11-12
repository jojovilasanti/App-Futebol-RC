
import React from 'react';
import { Game, User } from '../types';
import { ClockIcon, UsersIcon, CheckCircleIcon, ArrowRightIcon, BellIcon, TagIcon } from './icons/Icons';
import PlayerAvatar from './PlayerAvatar';
import Countdown from './Countdown';

interface GameCardProps {
  game: Game;
  currentUser: User;
  onRegister: (gameId: string) => void;
  onUnregister: (gameId: string) => void;
  onNavigate: (view: 'draw', gameId: string) => void;
  users: User[];
  isFirstGameOfDay: boolean;
  registrantsForDay: string[];
}

const GameCard: React.FC<GameCardProps> = ({ game, currentUser, onRegister, onUnregister, onNavigate, users, isFirstGameOfDay, registrantsForDay }) => {
  const isRegistered = registrantsForDay.includes(currentUser.id);
  const registrantsToShow = registrantsForDay.slice(0, 5).map(id => users.find(u => u.id === id)).filter(Boolean) as User[];
  const totalRegistrants = registrantsForDay.length;

  const getStatusInfo = () => {
    if (!isFirstGameOfDay) {
      if (game.status === 'finished') return { text: "Finalizado", color: "bg-gray-500" };
      return { text: "Aguardando Sorteio", color: "bg-yellow-500" };
    }
    switch (game.status) {
      case 'open': return { text: "Inscrições Abertas", color: "bg-green-500" };
      case 'drawing': return { text: "Sorteio Ao Vivo", color: "bg-yellow-500 animate-pulse" };
      case 'closed': return { text: "Inscrições Encerradas", color: "bg-red-500" };
      case 'finished': return { text: "Finalizado", color: "bg-gray-500" };
      default: return { text: "", color: "" };
    }
  };

  const statusInfo = getStatusInfo();

  const renderButton = () => {
    if (!isFirstGameOfDay) {
         if (game.status === 'finished') {
             return (
              <button
                onClick={() => onNavigate('draw', game.id)}
                className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-brand-blue dark:text-brand-blue-light bg-brand-blue/10 dark:bg-brand-blue/20 rounded-lg hover:bg-brand-blue/20 dark:hover:bg-brand-blue/30 transition-colors"
              >
                Ver Resultados
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </button>
            );
         }
         return (
            <button disabled className="w-full px-4 py-2.5 text-sm font-medium text-gray-500 bg-gray-200 dark:bg-gray-700 dark:text-gray-400 rounded-lg cursor-not-allowed">
                Aguardando sorteio
            </button>
         );
    }
    
    switch (game.status) {
      case 'open':
        if (currentUser.role === 'guest') {
            return (
                <button
                    disabled
                    className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-500 bg-gray-300 dark:bg-gray-700 dark:text-gray-400 rounded-lg cursor-not-allowed"
                >
                    Faça login para se inscrever
                </button>
            );
        }
        if (isRegistered) {
          return (
            <button
              onClick={() => onUnregister(game.id)}
              className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105"
            >
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              Cancelar Inscrição
            </button>
          );
        }
        return (
          <button
            onClick={() => onRegister(game.id)}
            className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-brand-blue hover:bg-brand-blue-dark rounded-lg transition-transform transform hover:scale-105"
          >
            Participar do Sorteio
          </button>
        );
      case 'drawing':
        return (
           <button
            onClick={() => onNavigate('draw', game.id)}
            className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-yellow-500 rounded-lg animate-pulse-fast"
          >
            <BellIcon className="w-5 h-5 mr-2"/>
            Acompanhar Sorteio
          </button>
        );
      case 'closed':
        return (
          <button
            disabled
            className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-500 bg-gray-300 dark:bg-gray-700 dark:text-gray-400 rounded-lg cursor-not-allowed"
          >
            Inscrições Encerradas
          </button>
        );
      case 'finished':
         return (
          <button
            onClick={() => onNavigate('draw', game.id)}
            className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-brand-blue dark:text-brand-blue-light bg-brand-blue/10 dark:bg-brand-blue/20 rounded-lg hover:bg-brand-blue/20 dark:hover:bg-brand-blue/30 transition-colors"
          >
            Ver Resultados
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </button>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between transition-transform transform hover:scale-105 border border-transparent hover:border-brand-blue dark:border-gray-700 dark:hover:border-brand-blue-light">
      {/* Header with Time and Status */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700/50 flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <ClockIcon className="w-6 h-6 text-brand-blue dark:text-brand-blue-light" />
            <span className="font-black text-2xl text-gray-800 dark:text-white">{game.time}</span>
        </div>
        <div className={`text-xs font-bold text-white px-2.5 py-1 rounded-full flex items-center ${statusInfo.color}`}>
          <TagIcon className="w-3 h-3 mr-1.5" />
          {statusInfo.text}
        </div>
      </div>

      <div className="p-5 flex-grow">
        {isFirstGameOfDay && game.status === 'open' && (
          <div className="mb-4">
            <p className="text-sm font-medium text-center text-gray-600 dark:text-gray-300 mb-2">Sorteio às 13:00. Fim das inscrições:</p>
            <Countdown date={game.date} />
          </div>
        )}
        
         {isFirstGameOfDay && (
            <>
                <div className="flex justify-center items-center space-x-2 text-gray-500 dark:text-gray-400 mb-3">
                    <UsersIcon className="w-5 h-5" />
                    <span className="font-semibold text-sm">{totalRegistrants} inscritos</span>
                </div>
                <div className="h-10 flex items-center justify-center space-x-[-12px]">
                {registrantsToShow.map(user => (
                    <PlayerAvatar key={user.id} user={user} size="sm" />
                ))}
                {totalRegistrants > 5 && (
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-gray-dark dark:bg-gray-700 text-xs font-bold text-brand-blue dark:text-brand-blue-light border-2 border-white dark:border-gray-800">
                    +{totalRegistrants - 5}
                    </div>
                )}
                </div>
            </>
         )}

         {!isFirstGameOfDay && (
           <div className="flex flex-col items-center justify-center h-full text-center">
             <p className="text-gray-500 dark:text-gray-400 text-sm">Este jogo será preenchido pelos jogadores restantes do sorteio principal.</p>
           </div>
         )}
      </div>

      {/* Footer with action button */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700/50">
        {renderButton()}
      </div>
    </div>
  );
};

export default GameCard;
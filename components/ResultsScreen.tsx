
import React from 'react';
import { Game, User } from '../types';
import PlayerAvatar from './PlayerAvatar';
import { CrownIcon } from './icons/Icons';

interface ResultsScreenProps {
  games: Game[];
  users: User[];
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ games, users }) => {
  const finishedGames = games
    .filter(g => g.status === 'finished')
    .sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('/');
        const dateA = new Date(`${yearA}-${monthA}-${dayA}T${a.time}:00`);
        const [dayB, monthB, yearB] = b.date.split('/');
        const dateB = new Date(`${yearB}-${monthB}-${dayB}T${b.time}:00`);
        return dateB.getTime() - dateA.getTime();
    });

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Histórico de Jogos</h1>
      
      <div className="space-y-8">
        {finishedGames.length > 0 ? (
          finishedGames.map(game => {
            const drawnPlayers = game.drawnPlayers.map(id => users.find(u => u.id === id)).filter(Boolean) as User[];
            
            return (
              <div key={game.id} className="bg-white dark:bg-sidebar-bg p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-brand-blue dark:text-brand-blue-light">
                  Jogo de {game.date} às {game.time}
                </h2>
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Jogadores Sorteados:</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {drawnPlayers.map(player => (
                      <div key={player.id} className="relative text-center">
                        <PlayerAvatar user={player} size="md" className="mx-auto" />
                        <p className="mt-1 font-medium text-xs truncate">{player.nickname}</p>
                        {(game.captains || []).includes(player.id) && (
                            <div className="absolute -top-1 -right-1 text-yellow-500">
                                <CrownIcon className="w-5 h-5" />
                            </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">Nenhum resultado de jogo anterior encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default ResultsScreen;
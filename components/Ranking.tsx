
import React, { useState, useMemo } from 'react';
import { User, Game } from '../types';
import { CrownIcon, TrophyIcon, StarIcon } from './icons/Icons';
import PlayerAvatar from './PlayerAvatar';

interface PlayerStats {
  user: User;
  participations: number;
  goals: number;
  captaincies: number;
}

const Ranking: React.FC<{ users: User[], games: Game[] }> = ({ users, games }) => {
  const [activeTab, setActiveTab] = useState<'participations' | 'goals' | 'captaincies'>('participations');

  const playerStats = useMemo(() => {
    const finishedGames = games.filter(g => g.status === 'finished');
    return users
      .filter(user => user.role === 'member') // Exclude admin from ranking
      .map(user => {
        const participations = finishedGames.filter(g => g.drawnPlayers.includes(user.id)).length;
        const captaincies = finishedGames.filter(g => (g.captains || []).includes(user.id)).length;
        return {
          user,
          participations,
          goals: user.goals || 0,
          captaincies,
        };
      });
  }, [users, games]);

  const sortedPlayers = useMemo(() => {
    return [...playerStats].sort((a, b) => {
      if (b[activeTab] !== a[activeTab]) {
        return b[activeTab] - a[activeTab];
      }
      return a.user.nickname.localeCompare(b.user.nickname); // Secondary sort by name
    });
  }, [playerStats, activeTab]);

  const tabs = [
    { key: 'participations' as const, label: 'Participações', icon: <TrophyIcon className="w-5 h-5" /> },
    { key: 'goals' as const, label: 'Gols', icon: <StarIcon className="w-5 h-5" /> },
    { key: 'captaincies' as const, label: 'Capitão', icon: <CrownIcon className="w-5 h-5" /> },
  ];

  const getStatValue = (player: PlayerStats) => {
    switch (activeTab) {
      case 'participations': return player.participations;
      case 'goals': return player.goals;
      case 'captaincies': return player.captaincies;
      default: return 0;
    }
  };

  return (
    <div className="bg-white dark:bg-sidebar-bg p-4 sm:p-6 rounded-2xl shadow-lg mt-8 animate-reveal">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ranking de Jogadores</h2>
      
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`${
                activeTab === tab.key
                  ? 'border-brand-blue text-brand-blue dark:text-brand-blue-light'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-500'
              } flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3 w-12 text-center">#</th>
              <th scope="col" className="px-6 py-3">Jogador</th>
              <th scope="col" className="px-6 py-3 text-right">{tabs.find(t => t.key === activeTab)?.label}</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.slice(0, 10).map((playerStat, index) => (
              <tr key={playerStat.user.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                <td className="px-4 py-3 font-bold text-lg text-center text-gray-700 dark:text-gray-300">{index + 1}</td>
                <td className="px-6 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  <div className="flex items-center">
                    <PlayerAvatar user={playerStat.user} size="sm" />
                    <span className="ml-3">{playerStat.user.nickname}</span>
                  </div>
                </td>
                <td className="px-6 py-3 font-bold text-lg text-right text-brand-blue dark:text-brand-blue-light">{getStatValue(playerStat)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ranking;

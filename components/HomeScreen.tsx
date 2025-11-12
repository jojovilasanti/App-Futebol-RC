import React from 'react';
import { Game, User, View } from '../types';
import GameCard from './GameCard';
import Ranking from './Ranking';
import { CalendarIcon, PlusIcon, UsersIcon, SwitchHorizontalIcon } from './icons/Icons';

interface HomeScreenProps {
  games: Game[];
  currentUser: User;
  onRegister: (gameId: string) => void;
  onUnregister: (gameId: string) => void;
  onNavigate: (view: View, id?: string) => void;
  users: User[];
  activeTradingDates: string[];
}

const HomeScreen: React.FC<HomeScreenProps> = ({ games, currentUser, onRegister, onUnregister, onNavigate, users, activeTradingDates }) => {
  const upcomingGames = games.filter(g => g.status !== 'finished');

  const getDayOfWeek = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', timeZone: 'UTC' };
    return new Intl.DateTimeFormat('pt-BR', options).format(date);
  };

  const groupedGames = upcomingGames.reduce((acc: Record<string, Game[]>, game) => {
    const dayKey = game.date; 
    if (!acc[dayKey]) {
      acc[dayKey] = [];
    }
    acc[dayKey].push(game);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {activeTradingDates.map(date => (
          <div key={date} className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-4 rounded-r-lg mb-6 flex items-center justify-between animate-reveal">
              <div>
                <p className="font-bold">Janela de Trocas Aberta!</p>
                <p className="text-sm">O período de trocas para os jogos de {date} está ativo. Negocie sua vaga agora!</p>
              </div>
              <button 
                onClick={() => onNavigate('trading', date)}
                className="flex items-center justify-center px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition-colors"
              >
                  <SwitchHorizontalIcon className="w-5 h-5 mr-2"/>
                  Ver Trocas
              </button>
          </div>
      ))}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Próximos Jogos</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Escolha um dia e participe do sorteio!</p>
        </div>
        {currentUser.role === 'admin' && (
             <button className="flex items-center justify-center px-5 py-3 bg-brand-blue text-white font-semibold rounded-lg shadow-md hover:bg-brand-blue-dark transition-colors">
                <PlusIcon className="w-5 h-5 mr-2" />
                Novo Jogo
            </button>
        )}
      </div>
      
      {Object.keys(groupedGames).sort((a,b) => {
         const [dayA, monthA, yearA] = a.split('/');
         const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
         const [dayB, monthB, yearB] = b.split('/');
         const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
         return dateA.getTime() - dateB.getTime();
      }).map((dateKey) => {
        const gamesForDay = groupedGames[dateKey];
        const dayTitle = `${getDayOfWeek(dateKey)}, ${dateKey}`;
        const sortedGames = gamesForDay.sort((a, b) => a.time.localeCompare(b.time));
        const masterGame = sortedGames[0]; // The first game handles all registrations for the day

        return (
          <div key={dateKey}>
            <div className="flex items-center mb-4">
              <CalendarIcon className="w-6 h-6 text-brand-blue dark:text-brand-blue-light" />
              <h2 className="ml-2 text-xl font-bold text-gray-800 dark:text-gray-100 capitalize">{dayTitle}</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedGames.map((game, index) => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  currentUser={currentUser}
                  onRegister={() => onRegister(masterGame.id)}
                  onUnregister={() => onUnregister(masterGame.id)}
                  onNavigate={onNavigate}
                  users={users}
                  isFirstGameOfDay={index === 0}
                  registrantsForDay={masterGame.registrants}
                />
              ))}
            </div>
          </div>
        );
      })}

      {upcomingGames.length === 0 && (
          <div className="text-center bg-white dark:bg-sidebar-bg p-12 rounded-2xl">
              <UsersIcon className="w-16 h-16 mx-auto text-gray-400" />
              <h3 className="mt-4 text-xl font-bold">Nenhum jogo disponível</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {currentUser.role === 'admin' ? 'Clique em "Novo Jogo" para criar o primeiro.' : 'Aguarde o administrador criar os próximos jogos.'}
              </p>
          </div>
      )}

      <Ranking users={users} games={games} />
    </div>
  );
};

export default HomeScreen;
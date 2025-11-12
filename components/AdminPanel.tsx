
import React, { useState, useMemo } from 'react';
import { Game, User, View, GameStatus } from '../types';
import { PlusIcon, TrophyIcon, UsersIcon, ClipboardListIcon, ChatAltIcon, CogIcon, ClockIcon, TicketIcon } from './icons/Icons';

// FIX: Removed unused props `onUpdateGameStatus`, `onSetDrawnPlayers`, and `onSetCaptains` to match component usage.
interface AdminPanelProps {
  games: Game[];
  users: User[];
  onNavigate: (view: View, id?: string) => void;
  onStartDraw: (gameId: string) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; subtitle: string; color: string; }> = ({ icon, title, value, subtitle, color }) => (
  <div className={`p-6 rounded-2xl ${color}`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-white/90 text-sm font-medium">{title}</p>
        <p className="text-white text-3xl font-bold mt-1">{value}</p>
        <p className="text-white/80 text-xs mt-1">{subtitle}</p>
      </div>
      <div className="text-white/80">{icon}</div>
    </div>
  </div>
);

const AdminPanel: React.FC<AdminPanelProps> = ({ games, users, onNavigate, onStartDraw }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const tabs = ['Dashboard', 'Jogos', 'Campeonatos', 'Sorteios', 'Usuários', 'Regras', 'Feedbacks'];

  // Calculate stats for the dashboard
  const totalGames = games.length;
  const openGames = games.filter(g => g.status === 'open').length;
  const finishedGames = games.filter(g => g.status === 'finished').length;
  
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.role !== 'admin').length; // simple logic for now
  const adminUsers = users.filter(u => u.role === 'admin').length;

  const totalInscriptions = games.reduce((acc, game) => acc + game.registrants.length, 0);

  const gamesByDate = useMemo(() => {
    return games.reduce((acc, game) => {
        if (game.status === 'open' || game.status === 'closed') {
            if (!acc[game.date]) {
                acc[game.date] = [];
            }
            acc[game.date].push(game);
        }
        return acc;
    }, {} as Record<string, Game[]>);
  }, [games]);

  const renderContent = () => {
    switch (activeTab) {
        case 'Dashboard':
            return (
                <div className="space-y-6">
                    <div className="p-8 rounded-2xl bg-brand-blue text-white flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold">Criar Novo Jogo</h3>
                            <p className="text-white/80 mt-1">Configure um novo jogo e comece a receber inscrições.</p>
                        </div>
                        <button className="bg-white text-brand-blue font-semibold px-6 py-3 rounded-lg flex-shrink-0 hover:bg-gray-200 transition-colors">
                            Criar Agora
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                         <StatCard icon={<TrophyIcon className="w-8 h-8"/>} title="Total de Jogos" value={totalGames} subtitle={`${openGames} abertos • ${finishedGames} finalizados`} color="bg-blue-500" />
                         <StatCard icon={<UsersIcon className="w-8 h-8"/>} title="Usuários" value={totalUsers} subtitle={`${activeUsers} ativos • ${adminUsers} admins`} color="bg-green-500" />
                         <StatCard icon={<ClipboardListIcon className="w-8 h-8"/>} title="Inscrições" value={totalInscriptions} subtitle="100.0% sucesso" color="bg-purple-500" />
                         <StatCard icon={<ChatAltIcon className="w-8 h-8"/>} title="Feedbacks" value={0} subtitle="0 não lidos" color="bg-orange-500" />
                    </div>
                    
                    {/* Placeholder for future components */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-sidebar-bg p-6 rounded-xl">
                            <h4 className="font-bold">Atividade Recente</h4>
                            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Em breve...</p>
                        </div>
                         <div className="bg-white dark:bg-sidebar-bg p-6 rounded-xl">
                            <h4 className="font-bold">Top Jogadores</h4>
                            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Em breve...</p>
                        </div>
                    </div>
                </div>
            );
        case 'Sorteios':
            return (
                <div className="bg-white dark:bg-sidebar-bg p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-4">Iniciar Sorteio</h3>
                    <div className="space-y-4">
                        {Object.keys(gamesByDate).length > 0 ? Object.entries(gamesByDate).map(([date, gamesOnDay]) => {
                            const masterGame = gamesOnDay.sort((a,b) => a.time.localeCompare(b.time))[0];
                            const isReady = masterGame.registrants.length > 0;
                            const isDrawing = gamesOnDay.some(g => g.status === 'drawing');

                            return (
                                <div key={date} className="flex flex-col sm:flex-row justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-gray-100">Jogos de {date}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{masterGame.registrants.length} jogadores inscritos.</p>
                                    </div>
                                    {isDrawing ? (
                                        <button 
                                            onClick={() => onNavigate('draw', masterGame.id)}
                                            className="mt-2 sm:mt-0 flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md animate-pulse-fast">
                                            <TicketIcon className="w-5 h-5 mr-2" />
                                            Sorteio em Andamento
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onStartDraw(masterGame.id)}
                                            disabled={!isReady}
                                            className="mt-2 sm:mt-0 flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-brand-green text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                                            <TicketIcon className="w-5 h-5 mr-2" />
                                            Iniciar Sorteio
                                        </button>
                                    )}
                                </div>
                            )
                        }) : <p className="text-gray-500 dark:text-gray-400">Nenhum jogo disponível para sorteio.</p>}
                    </div>
                </div>
            );
        case 'Campeonatos':
             return (
                <div className="bg-white dark:bg-sidebar-bg p-6 rounded-xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                        <h3 className="text-xl font-bold">Gerenciar Campeonatos</h3>
                        <button
                            onClick={() => onNavigate('championshipForm')}
                            className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg shadow-md hover:bg-brand-blue-dark transition-colors">
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Novo Campeonato
                        </button>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                        Aqui você pode criar, editar e excluir campeonatos. Use a tela principal de campeonatos para gerenciar os existentes.
                    </p>
                </div>
            );
        default:
            return <div className="bg-white dark:bg-sidebar-bg p-12 rounded-xl text-center"><h3 className="text-xl font-bold">{activeTab}</h3><p className="mt-2 text-gray-500 dark:text-gray-400">Conteúdo em construção.</p></div>
    }
  }


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Painel Administrativo</h2>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Gerencie jogos, usuários e configurações do sistema.</p>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-brand-blue text-brand-blue dark:text-brand-blue-light'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-500'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPanel;

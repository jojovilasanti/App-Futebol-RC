

import React, { useState, useMemo } from 'react';
import { Game, User, View, GameStatus, Invitation } from '../types';
import { PlusIcon, TrophyIcon, UsersIcon, ClipboardListIcon, ChatAltIcon, CogIcon, ClockIcon, TicketIcon, PaperAirplaneIcon, TrashIcon, CheckCircleIcon, ArrowUpCircleIcon, EnvelopeIcon } from './icons/Icons';

interface AdminPanelProps {
  games: Game[];
  users: User[];
  invitations: Invitation[];
  onNavigate: (view: View, id?: string) => void;
  onStartDraw: (gameId: string) => void;
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
  onSendInvite: (email: string) => void;
  onPromoteUserToAdmin: (userId: string) => void;
  onUpdateLogo: (logoDataUrl: string) => void;
  currentLogo: string | null;
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

const AdminPanel: React.FC<AdminPanelProps> = ({ games, users, invitations, onNavigate, onStartDraw, onApproveUser, onRejectUser, onSendInvite, onPromoteUserToAdmin, onUpdateLogo, currentLogo }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [inviteEmail, setInviteEmail] = useState('');

  const tabs = ['Dashboard', 'Jogos', 'Campeonatos', 'Sorteios', 'Usuários', 'Configurações', 'Regras', 'Feedbacks'];

  // Calculate stats for the dashboard
  const totalGames = games.length;
  const openGames = games.filter(g => g.status === 'open').length;
  const finishedGames = games.filter(g => g.status === 'finished').length;
  
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.role !== 'admin' && u.status === 'active').length;
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

  const pendingUsers = useMemo(() => users.filter(u => u.status === 'pending'), [users]);
  const activeMembers = useMemo(() => users.filter(u => u.status === 'active' && u.role === 'member'), [users]);

  const handleInviteSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (inviteEmail.trim()) {
          onSendInvite(inviteEmail.trim());
          setInviteEmail('');
      }
  };
  
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
              onUpdateLogo(reader.result as string);
          };
          reader.readAsDataURL(file);
      } else {
        alert('Por favor, selecione um arquivo de imagem válido.');
      }
  };


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
        case 'Usuários':
            return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Pending Approvals */}
                        <div className="bg-white dark:bg-sidebar-bg p-6 rounded-xl">
                            <h3 className="text-xl font-bold mb-4">Aprovar Cadastros ({pendingUsers.length})</h3>
                            {pendingUsers.length > 0 ? (
                                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                    {pendingUsers.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                            <div>
                                                <p className="font-bold text-gray-800 dark:text-gray-100">{user.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">@{user.nickname} - {user.position}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button onClick={() => onApproveUser(user.id)} className="p-2 text-white bg-green-500 rounded-full hover:bg-green-600"><CheckCircleIcon className="w-5 h-5"/></button>
                                                <button onClick={() => onRejectUser(user.id)} className="p-2 text-white bg-red-600 rounded-full hover:bg-red-700"><TrashIcon className="w-5 h-5"/></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum cadastro pendente.</p>
                            )}
                        </div>
                        {/* Invite User */}
                        <div className="bg-white dark:bg-sidebar-bg p-6 rounded-xl">
                            <h3 className="text-xl font-bold mb-4">Convidar Novo Sócio</h3>
                            <form onSubmit={handleInviteSubmit} className="flex space-x-2">
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    placeholder="email@do.socio"
                                    className="flex-grow appearance-none rounded-md relative block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                />
                                <button type="submit" className="flex items-center justify-center px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg shadow-md hover:bg-brand-blue-dark">
                                    <PaperAirplaneIcon className="w-5 h-5"/>
                                </button>
                            </form>
                            <div className="mt-6">
                                <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center"><EnvelopeIcon className="w-5 h-5 mr-2" /> Convites Enviados</h4>
                                {invitations.length > 0 ? (
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                        {invitations.map(inv => (
                                            <div key={inv.id} className="flex items-center justify-between text-sm p-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
                                                <div className="truncate">
                                                    <p className="font-medium text-gray-700 dark:text-gray-300 truncate">{inv.email}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Enviado em: {inv.sentAt.toLocaleDateString('pt-BR')}
                                                    </p>
                                                </div>
                                                {inv.status === 'sent' ? (
                                                    <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50 px-2 py-1 rounded-full">Pendente</span>
                                                ) : (
                                                    <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full">Cadastrado</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum convite enviado ainda.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className="bg-white dark:bg-sidebar-bg p-6 rounded-xl">
                        <h3 className="text-xl font-bold mb-4">Sócios Ativos ({activeMembers.length})</h3>
                        <div className="space-y-2 max-h-[34rem] overflow-y-auto pr-2">
                          {activeMembers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <div className="flex items-center overflow-hidden">
                                    <img src={user.avatarUrl} alt={user.nickname} className="w-8 h-8 rounded-full flex-shrink-0"/>
                                    <div className="ml-3">
                                      <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">{user.nickname}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onPromoteUserToAdmin(user.id)}
                                    className="p-2 text-blue-500 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors ml-2 flex-shrink-0"
                                    title="Promover a Administrador"
                                >
                                    <ArrowUpCircleIcon className="w-5 h-5"/>
                                </button>
                            </div>
                          ))}
                        </div>
                    </div>
                </div>
            );
        case 'Configurações':
             return (
                <div className="bg-white dark:bg-sidebar-bg p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-4">Personalizar Aparência</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="logo-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Logo do Aplicativo
                            </label>
                            <div className="mt-1 flex items-center space-x-4">
                                <span className="inline-block h-20 w-40 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                    {currentLogo ? (
                                        <img src={currentLogo} alt="Logo atual" className="h-full w-full object-contain" />
                                    ) : (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Sem logo</span>
                                    )}
                                </span>
                                <label htmlFor="logo-upload" className="cursor-pointer bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
                                    <span>Trocar</span>
                                    <input id="logo-upload" name="logo-upload" type="file" className="sr-only" accept="image/*" onChange={handleLogoFileChange} />
                                </label>
                            </div>
                        </div>
                    </div>
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
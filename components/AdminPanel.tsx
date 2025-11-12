

import React, { useState, useMemo, useEffect } from 'react';
import { Game, User, View, GameStatus, Invitation } from '../types';
import { PlusIcon, TrophyIcon, UsersIcon, ClipboardListIcon, ChatAltIcon, CogIcon, ClockIcon, TicketIcon, PaperAirplaneIcon, TrashIcon, CheckCircleIcon, ArrowUpCircleIcon, EnvelopeIcon } from './icons/Icons';

interface AdminPanelProps {
  games: Game[];
  users: User[];
  invitations: Invitation[];
  onNavigate: (view: View, id?: string) => void;
  onStartDraw: (gameId: string) => void;
  onSaveChanges: (data: { users: User[], invitations: Invitation[], logoUrl: string | null }) => void;
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

const AdminPanel: React.FC<AdminPanelProps> = ({ games, users, invitations, onNavigate, onStartDraw, onSaveChanges, currentLogo }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  const [localUsers, setLocalUsers] = useState<User[]>(users);
  const [localInvitations, setLocalInvitations] = useState<Invitation[]>(invitations);
  const [localLogo, setLocalLogo] = useState<string | null>(currentLogo);
  const [hasChanges, setHasChanges] = useState(false);

  const [inviteEmail, setInviteEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserMembershipNumber, setNewUserMembershipNumber] = useState('');

  // Sync props to local state when they change from parent
  useEffect(() => {
    setLocalUsers(users);
  }, [users]);
  useEffect(() => {
    setLocalInvitations(invitations);
  }, [invitations]);
  useEffect(() => {
    setLocalLogo(currentLogo);
  }, [currentLogo]);


  const tabs = ['Dashboard', 'Jogos', 'Campeonatos', 'Sorteios', 'Usuários', 'Configurações', 'Regras', 'Feedbacks'];

  // Calculate stats for the dashboard (using local state for accuracy)
  const totalGames = games.length;
  const openGames = games.filter(g => g.status === 'open').length;
  const finishedGames = games.filter(g => g.status === 'finished').length;
  
  const totalUsers = localUsers.length;
  const activeUsers = localUsers.filter(u => u.role !== 'admin' && u.status === 'active').length;
  const adminUsers = localUsers.filter(u => u.role === 'admin').length;

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

  const pendingUsers = useMemo(() => localUsers.filter(u => u.status === 'pending'), [localUsers]);
  const activeMembers = useMemo(() => localUsers.filter(u => u.status === 'active' && u.role === 'member'), [localUsers]);

  // Local state handlers
  const handleApproveUser = (userId: string) => {
    setLocalUsers(prev => prev.map(u => u.id === userId ? {...u, status: 'active'} : u));
    setHasChanges(true);
  };

  const handleRejectUser = (userId: string) => {
    if (window.confirm('Tem certeza que deseja recusar este cadastro? A ação não pode ser desfeita.')) {
        setLocalUsers(prev => prev.filter(u => u.id !== userId));
        setHasChanges(true);
    }
  };

  const handlePromoteUserToAdmin = (userId: string) => {
    if (window.confirm('Tem certeza que deseja promover este usuário a administrador? Esta ação não pode ser desfeita.')) {
        setLocalUsers(prev => prev.map(u => u.id === userId ? { ...u, role: 'admin' } : u));
        setHasChanges(true);
    }
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const email = inviteEmail.trim();
    if (!email) return;

    const userExists = localUsers.some(u => u.email?.toLowerCase() === email.toLowerCase());
    if (userExists) {
        alert('Já existe um sócio cadastrado com este e-mail.');
        return;
    }
    const invitationExists = localInvitations.some(inv => inv.email.toLowerCase() === email.toLowerCase());
    if (invitationExists) {
        alert('Um convite para este e-mail já foi enviado.');
        return;
    }

    const newInvitation: Invitation = {
        id: `inv-${Date.now()}`,
        email: email,
        status: 'sent',
        sentAt: new Date(),
    };
    setLocalInvitations(prev => [newInvitation, ...prev]);
    setInviteEmail('');
    setHasChanges(true);
  };
  
  const handleAdminCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newUserName.trim();
    const number = newUserMembershipNumber.trim();

    if (!name || !number) {
        alert('Nome e número de título são obrigatórios.');
        return;
    }

    const userExists = localUsers.some(u => u.membershipNumber === number);
    if (userExists) {
        alert('Já existe um usuário com este número de título.');
        return;
    }

    const newUser: User = {
        id: `user-${Date.now()}`,
        name: name,
        nickname: name.split(' ')[0],
        membershipNumber: number,
        email: `${number}@futebolrc.com`, // Placeholder email
        position: 'Atacante',
        avatarUrl: `https://ui-avatars.com/api/?name=${name.charAt(0)}&background=random&color=fff&size=128`,
        role: 'member',
        status: 'active',
        goals: 0,
        rating: 3,
        level: 1,
        xp: 0,
// FIX: The user attributes were not matching the User type. They should be an object with score and count.
        attributes: { attack: { score: 50, count: 1 }, defense: { score: 50, count: 1 }, speed: { score: 50, count: 1 }, passing: { score: 50, count: 1 } },
    };

    setLocalUsers(prev => [...prev, newUser]);
    setNewUserName('');
    setNewUserMembershipNumber('');
    setHasChanges(true);
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setLocalLogo(reader.result as string);
            setHasChanges(true);
        };
        reader.readAsDataURL(file);
    } else {
      alert('Por favor, selecione um arquivo de imagem válido.');
    }
  };

  const handleSave = () => {
    onSaveChanges({
      users: localUsers,
      invitations: localInvitations,
      logoUrl: localLogo,
    });
    setHasChanges(false);
  };

  const handleDiscard = () => {
    if (window.confirm('Tem certeza que deseja descartar suas alterações não salvas?')) {
      setLocalUsers(users);
      setLocalInvitations(invitations);
      setLocalLogo(currentLogo);
      setHasChanges(false);
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
                         <StatCard icon={<ClipboardListIcon className="w-8 h-8"/>} title="Inscrições" value={totalInscriptions} subtitle="na temporada" color="bg-purple-500" />
                         <StatCard icon={<ChatAltIcon className="w-8 h-8"/>} title="Feedbacks" value={0} subtitle="0 não lidos" color="bg-orange-500" />
                    </div>
                    
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
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-sidebar-bg p-6 rounded-xl">
                            <h3 className="text-xl font-bold mb-4">Aprovar Cadastros ({pendingUsers.length})</h3>
                            {pendingUsers.length > 0 ? (
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                    {pendingUsers.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                            <div>
                                                <p className="font-bold text-gray-800 dark:text-gray-100">{user.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">@{user.nickname} - {user.position}</p>
                                            </div>
                                            <div className="flex space-x-2 flex-shrink-0">
                                                <button onClick={() => handleApproveUser(user.id)} className="p-2 text-white bg-green-500 rounded-full hover:bg-green-600"><CheckCircleIcon className="w-5 h-5"/></button>
                                                <button onClick={() => handleRejectUser(user.id)} className="p-2 text-white bg-red-600 rounded-full hover:bg-red-700"><TrashIcon className="w-5 h-5"/></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum cadastro pendente.</p>}
                        </div>

                        <div className="bg-white dark:bg-sidebar-bg p-6 rounded-xl">
                            <h3 className="text-xl font-bold mb-4">Adicionar Sócio Manualmente</h3>
                            <form onSubmit={handleAdminCreateUser} className="space-y-3">
                                <input type="text" value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="Nome Completo" required className="appearance-none rounded-md relative block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                                <input type="text" value={newUserMembershipNumber} onChange={e => setNewUserMembershipNumber(e.target.value)} placeholder="Nº de título" required className="appearance-none rounded-md relative block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                                <button type="submit" className="w-full flex items-center justify-center px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg shadow-md hover:bg-brand-blue-dark">
                                    <PlusIcon className="w-5 h-5 mr-2"/> Adicionar Sócio
                                </button>
                            </form>
                        </div>
                        
                        <div className="bg-white dark:bg-sidebar-bg p-6 rounded-xl">
                            <h3 className="text-xl font-bold mb-4">Convidar Novo Sócio</h3>
                            <form onSubmit={handleSendInvite} className="flex space-x-2">
                                <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="email@do.socio" className="flex-grow appearance-none rounded-md relative w-full px-4 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                                <button type="submit" className="flex-shrink-0 flex items-center justify-center px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg shadow-md hover:bg-brand-blue-dark">
                                    <PaperAirplaneIcon className="w-5 h-5"/>
                                </button>
                            </form>
                            <div className="mt-6">
                                <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center"><EnvelopeIcon className="w-5 h-5 mr-2" /> Convites Enviados</h4>
                                {localInvitations.length > 0 ? (
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                        {localInvitations.map(inv => (
                                            <div key={inv.id} className="flex items-center justify-between text-sm p-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
                                                <div className="truncate"><p className="font-medium text-gray-700 dark:text-gray-300 truncate">{inv.email}</p><p className="text-xs text-gray-500 dark:text-gray-400">Enviado em: {new Date(inv.sentAt).toLocaleDateString('pt-BR')}</p></div>
                                                {inv.status === 'sent' ? <span className="flex-shrink-0 text-xs font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50 px-2 py-1 rounded-full">Pendente</span> : <span className="flex-shrink-0 text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full">Cadastrado</span>}
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum convite enviado ainda.</p>}
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-sidebar-bg p-6 rounded-xl">
                        <h3 className="text-xl font-bold mb-4">Sócios Ativos ({activeMembers.length})</h3>
                        <div className="space-y-2 max-h-[54rem] overflow-y-auto pr-2">
                          {activeMembers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <div className="flex items-center overflow-hidden"><img src={user.avatarUrl} alt={user.nickname} className="w-8 h-8 rounded-full flex-shrink-0"/><div className="ml-3"><p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">{user.nickname}</p><p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.name}</p></div></div>
                                <button onClick={() => handlePromoteUserToAdmin(user.id)} className="p-2 text-blue-500 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors ml-2 flex-shrink-0" title="Promover a Administrador"><ArrowUpCircleIcon className="w-5 h-5"/></button>
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
                    <div className="space-y-4"><div><label htmlFor="logo-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logo do Aplicativo</label><div className="mt-1 flex items-center space-x-4"><span className="inline-block h-20 w-40 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">{localLogo ? <img src={localLogo} alt="Logo atual" className="h-full w-full object-contain" /> : <span className="text-xs text-gray-500 dark:text-gray-400">Sem logo</span>}</span><label htmlFor="logo-upload" className="cursor-pointer bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"><span>Trocar</span><input id="logo-upload" name="logo-upload" type="file" className="sr-only" accept="image/*" onChange={handleLogoFileChange} /></label></div></div></div>
                </div>
            );
        default:
            return <div className="bg-white dark:bg-sidebar-bg p-12 rounded-xl text-center"><h3 className="text-xl font-bold">{activeTab}</h3><p className="mt-2 text-gray-500 dark:text-gray-400">Conteúdo em construção.</p></div>
    }
  }

  return (
    <div className="space-y-6">
      {hasChanges && (
        <div className="sticky top-2 z-20 bg-brand-dark-blue p-4 rounded-lg shadow-lg flex flex-col sm:flex-row items-center justify-between animate-reveal gap-4">
            <p className="font-semibold text-white text-center sm:text-left">Você tem alterações não salvas.</p>
            <div className="flex space-x-2 flex-shrink-0">
                <button onClick={handleDiscard} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-500">
                    Descartar
                </button>
                <button onClick={handleSave} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-brand-green hover:bg-brand-green-dark flex items-center">
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    Salvar Alterações
                </button>
            </div>
        </div>
      )}

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
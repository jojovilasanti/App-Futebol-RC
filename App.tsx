
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, Game, GameStatus, View, Championship, Trade, Invitation } from './types';
import { MOCK_USERS, MOCK_GAMES, MOCK_CHAMPIONSHIPS } from './data/mockData';
// Fix: Import defaultLogo to be used in the application.
import { defaultLogo } from './data/logo';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import Sidebar from './components/Sidebar';
import HomeScreen from './components/HomeScreen';
import DrawScreen from './components/DrawScreen';
import AdminPanel from './components/AdminPanel';
import ResultsScreen from './components/ResultsScreen';
import ChampionshipsScreen from './components/ChampionshipsScreen';
import ChampionshipDetailsScreen from './components/ChampionshipDetailsScreen';
import ChampionshipForm from './components/ChampionshipForm';
import TradingScreen from './components/TradingScreen';
import ProfileScreen from './components/ProfileScreen';
import RatingScreen from './components/RatingScreen';
import GameForm from './components/GameForm';
import { MenuIcon, SunIcon, MoonIcon } from './components/icons/Icons';

type NewUserData = Omit<User, 'id' | 'avatarUrl' | 'role' | 'goals' | 'status'>;

const GUEST_USER: User = {
  id: 'guest',
  name: 'Convidado',
  nickname: 'Convidado',
  position: 'Atacante',
  avatarUrl: `https://ui-avatars.com/api/?name=C&background=2563eb&color=fff&size=128`,
  membershipNumber: '0000',
  role: 'guest',
  goals: 0,
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('futebol_rc_users');
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });
  
  const [games, setGames] = useState<Game[]>(() => {
    const saved = localStorage.getItem('futebol_rc_games');
    return saved ? JSON.parse(saved) : MOCK_GAMES;
  });

  const [championships, setChampionships] = useState<Championship[]>(() => {
    const saved = localStorage.getItem('futebol_rc_championships');
    return saved ? JSON.parse(saved) : MOCK_CHAMPIONSHIPS;
  });
  const [tradeProposals, setTradeProposals] = useState<Trade[]>([]);
  
  const [invitations, setInvitations] = useState<Invitation[]>(() => {
      const saved = localStorage.getItem('futebol_rc_invitations');
      return saved ? JSON.parse(saved).map((inv: Invitation) => ({ ...inv, sentAt: new Date(inv.sentAt) })) : [];
  });
  
  const [activeView, setActiveView] = useState<View>('home');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [activeChampionshipId, setActiveChampionshipId] = useState<string | null>(null);
  const [activeTradingDate, setActiveTradingDate] = useState<string | null>(null);
  const [championshipFormMode, setChampionshipFormMode] = useState<'create' | 'edit'>('create');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('futebol_rc_games', JSON.stringify(games));
  }, [games]);
  
  useEffect(() => {
    localStorage.setItem('futebol_rc_championships', JSON.stringify(championships));
  }, [championships]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLoginAsGuest = () => {
    setCurrentUser(GUEST_USER);
  };

  const handleLogin = (name: string, membershipNumber: string) => {
    const user = users.find(
      u => (u.name.toLowerCase() === name.toLowerCase() || u.nickname.toLowerCase() === name.toLowerCase()) && u.membershipNumber === membershipNumber
    );
    if (user) {
      if (user.status === 'pending') {
        alert('Seu cadastro está aguardando aprovação do administrador.');
      } else {
        setCurrentUser(user);
      }
    } else {
      alert('Usuário ou senha inválidos. Por favor, verifique seus dados ou cadastre-se.');
    }
  };
  
  const handleRegisterSubmit = (newUserData: NewUserData) => {
    const userExists = users.some(u => u.email === newUserData.email || u.membershipNumber === newUserData.membershipNumber);
    if (userExists) {
        alert('Um usuário com este e-mail ou número de título já existe.');
        return;
    }
      
    const newUser: User = {
        ...newUserData,
        id: `user-${Date.now()}`,
        avatarUrl: `https://ui-avatars.com/api/?name=${newUserData.name.charAt(0)}&background=random&color=fff&size=128`,
        role: 'member',
        goals: 0,
        status: 'pending',
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('futebol_rc_users', JSON.stringify(updatedUsers));
    
    const updatedInvitations = invitations.map((inv): Invitation =>
        inv.email.toLowerCase() === newUser.email?.toLowerCase() ? { ...inv, status: 'registered' } : inv
    );
    setInvitations(updatedInvitations);
    localStorage.setItem('futebol_rc_invitations', JSON.stringify(updatedInvitations));

    alert('Cadastro realizado com sucesso! Aguarde a aprovação do administrador para acessar o sistema.');
    setAuthView('login');
  };
  
  const handleSaveChangesFromAdmin = (data: { users: User[], invitations: Invitation[] }) => {
    setUsers(data.users);
    localStorage.setItem('futebol_rc_users', JSON.stringify(data.users));
    
    setInvitations(data.invitations);
    localStorage.setItem('futebol_rc_invitations', JSON.stringify(data.invitations));
    
    alert('Alterações salvas com sucesso!');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('home');
    setAuthView('login');
  };

  const navigateTo = (view: View, id?: string) => {
    setActiveView(view);

    if (view === 'draw') {
      setActiveGameId(id || null);
    }
    
    if (view === 'championshipDetails') {
      setActiveChampionshipId(id || null);
    }
    
    if (view === 'trading') {
      setActiveTradingDate(id || null);
    }

    if (view === 'championshipForm') {
      if (id) {
        setActiveChampionshipId(id);
        setChampionshipFormMode('edit');
      } else {
        setActiveChampionshipId(null);
        setChampionshipFormMode('create');
      }
    }
    
    setSidebarOpen(false);
  };

  const handleRegister = useCallback((gameId: string) => {
    if (!currentUser || currentUser.role === 'guest') return;
    setGames(prevGames =>
      prevGames.map(game => {
        if (game.id === gameId && !game.registrants.includes(currentUser.id)) {
          return { ...game, registrants: [...game.registrants, currentUser.id] };
        }
        return game;
      })
    );
  }, [currentUser]);
  
  const handleUnregister = useCallback((gameId: string) => {
    if (!currentUser || currentUser.role === 'guest') return;
    setGames(prevGames =>
      prevGames.map(game => {
        if (game.id === gameId) {
          return { ...game, registrants: game.registrants.filter(id => id !== currentUser.id) };
        }
        return game;
      })
    );
  }, [currentUser]);

  const updateGameStatus = (gameId: string, status: GameStatus) => {
    setGames(prev => prev.map(g => g.id === gameId ? {...g, status} : g));
  };
  
  const handleStartDraw = (gameId: string) => {
    updateGameStatus(gameId, 'drawing');
    navigateTo('draw', gameId);
  };

  const handleDrawComplete = (gameId: string, drawnIds: string[], remainingIds: string[]) => {
    setGames(prevGames => {
        let gamesCopy = prevGames.map(g => ({...g})); 
        const sourceGame = gamesCopy.find(g => g.id === gameId);
        if (!sourceGame) return prevGames;

        sourceGame.status = 'finished';
        sourceGame.drawnPlayers = drawnIds;
        sourceGame.tradingEndTime = new Date(new Date().getTime() + 15 * 60000).getTime(); // 15 minutes for trading

        const sameDayGames = gamesCopy
            .filter(g => g.date === sourceGame.date && g.id !== sourceGame.id && g.status !== 'finished')
            .sort((a, b) => a.time.localeCompare(b.time));

        let playersToDistribute = [...remainingIds];
        for (const nextGame of sameDayGames) {
            if (playersToDistribute.length === 0) break;
            const numToDraw = nextGame.maxPlayers || 20;
            const drawnForThisGame = playersToDistribute.splice(0, numToDraw);
            nextGame.drawnPlayers = drawnForThisGame;
            if (drawnForThisGame.length > 0) {
              nextGame.status = 'finished';
            }
        }
        
        return gamesCopy;
    });
  };

  const handleUpdateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('futebol_rc_users', JSON.stringify(updatedUsers));
    alert('Perfil atualizado com sucesso!');
  };

  const handleSaveGame = (data: Omit<Game, 'id' | 'registrants' | 'drawnPlayers' | 'status' | 'captains'>) => {
      const newGame: Game = {
          ...data,
          id: `game-${Date.now()}`,
          status: 'open',
          registrants: [],
          drawnPlayers: [],
          captains: [],
      };
      setGames(g => [...g, newGame]);
      navigateTo('admin');
  };
  
  const handleDeleteGame = (gameId: string) => {
    if(window.confirm('Tem certeza que deseja excluir este jogo?')) {
        setGames(prev => prev.filter(g => g.id !== gameId));
    }
  };

  const handleSaveChampionship = (data: Omit<Championship, 'id'> | Championship) => {
      if ('id' in data) {
          setChampionships(cs => cs.map(c => c.id === (data as Championship).id ? data as Championship : c));
      } else {
          const newChampionship: Championship = {
              ...(data as Omit<Championship, 'id'>),
              id: `champ-${Date.now()}`,
          };
          setChampionships(cs => [...cs, newChampionship]);
      }
      navigateTo('championships');
  };

  const handleDeleteChampionship = (id: string) => {
      if(window.confirm('Tem certeza que deseja excluir este campeonato?')) {
          setChampionships(prev => prev.filter(c => c.id !== id));
      }
  };
  
  const handleRatePlayers = (ratings: Record<string, { attack: number; defense: number; speed: number; passing: number; }>) => {
    console.log('Ratings submitted:', ratings);
    alert('Avaliações enviadas com sucesso!');
    // In a real app, this would update user stats and mark the game as rated
    navigateTo('profile');
  };

  const activeTradingDates = useMemo(() => {
      return Array.from(new Set(games.filter(g => g.tradingEndTime && g.tradingEndTime > Date.now()).map(g => g.date)));
  }, [games]);

  if (!currentUser) {
    return authView === 'login' ? (
      <LoginScreen 
        logoUrl={defaultLogo}
        onLogin={handleLogin}
        onLoginAsGuest={handleLoginAsGuest}
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigateToRegister={() => setAuthView('register')}
      />
    ) : (
      <RegisterScreen
        onRegister={handleRegisterSubmit}
        onNavigateToLogin={() => setAuthView('login')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  const renderView = () => {
    const activeGame = games.find(g => g.id === activeGameId);
    const activeChampionship = championships.find(c => c.id === activeChampionshipId);
    
    switch (activeView) {
      case 'home':
        return <HomeScreen games={games} currentUser={currentUser} onRegister={handleRegister} onUnregister={handleUnregister} onNavigate={navigateTo} users={users} activeTradingDates={activeTradingDates} />;
      case 'draw':
        return activeGame ? <DrawScreen game={activeGame} users={users} currentUser={currentUser} onDrawComplete={handleDrawComplete} /> : <div>Jogo não encontrado.</div>;
      case 'admin':
        return <AdminPanel games={games} users={users} invitations={invitations} onNavigate={navigateTo} onStartDraw={handleStartDraw} onSaveChanges={handleSaveChangesFromAdmin} onDeleteGame={handleDeleteGame} />;
      case 'results':
      case 'history':
        return <ResultsScreen games={games} users={users} />;
      case 'championships':
        return <ChampionshipsScreen championships={championships} currentUser={currentUser} onNavigate={navigateTo} />;
      case 'championshipDetails':
        return activeChampionship ? <ChampionshipDetailsScreen championship={activeChampionship} currentUser={currentUser} onNavigate={navigateTo} onDelete={handleDeleteChampionship} /> : <div>Campeonato não encontrado.</div>;
      case 'championshipForm':
        return <ChampionshipForm mode={championshipFormMode} initialData={activeChampionship} onSave={handleSaveChampionship} onCancel={() => navigateTo(activeChampionshipId ? 'championshipDetails' : 'championships', activeChampionshipId || undefined)} />;
      case 'trading': {
        const gamesForDay = games.filter(g => g.date === activeTradingDate && g.status === 'finished');
        return <TradingScreen gamesForDay={gamesForDay} users={users} currentUser={currentUser} tradeProposals={tradeProposals} onProposeTrade={() => {}} onRespondToTrade={() => {}} tradedPlayerIds={[]} />;
      }
      case 'profile':
        return <ProfileScreen user={currentUser} games={games} onUpdateProfile={handleUpdateProfile} onNavigate={navigateTo} hasLastGameToRate={true} />; // Simplified
      case 'rating': {
        const lastGame = games.filter(g => g.status === 'finished' && g.drawnPlayers.includes(currentUser.id)).sort((a,b) => b.id.localeCompare(a.id))[0];
        const playersToRate = lastGame?.drawnPlayers.filter(pId => pId !== currentUser.id).map(pId => users.find(u => u.id === pId)).filter(Boolean) as User[] || [];
        return <RatingScreen currentUser={currentUser} playersToRate={playersToRate} onRatePlayers={handleRatePlayers} onCancel={() => navigateTo('profile')} />;
      }
      case 'gameForm':
        return <GameForm onSave={handleSaveGame} onCancel={() => navigateTo('admin')} />;
      default:
        return <div>Página não encontrada</div>;
    }
  };

  return (
    <div className={`flex h-screen bg-main-bg-light dark:bg-main-bg-dark font-sans`}>
      <Sidebar 
        logoUrl={defaultLogo}
        user={currentUser}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
        onNavigate={navigateTo}
        activeView={activeView}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        activeTradingDates={activeTradingDates}
      />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-sidebar-bg sticky top-0 z-20 border-b border-gray-200 dark:border-gray-700">
          <button onClick={() => setSidebarOpen(true)}>
            <MenuIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          </button>
          <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
          </button>
        </header>
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

// Fix: Add default export to make it importable in index.tsx
export default App;

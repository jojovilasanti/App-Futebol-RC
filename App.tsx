
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, Game, GameStatus, View, Championship, Trade } from './types';
import { MOCK_USERS, MOCK_GAMES, MOCK_CHAMPIONSHIPS } from './data/mockData';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import HomeScreen from './components/HomeScreen';
import DrawScreen from './components/DrawScreen';
import AdminPanel from './components/AdminPanel';
import ResultsScreen from './components/ResultsScreen';
import ChampionshipsScreen from './components/ChampionshipsScreen';
import ChampionshipDetailsScreen from './components/ChampionshipDetailsScreen';
import ChampionshipForm from './components/ChampionshipForm';
import TradingScreen from './components/TradingScreen';
import { MenuIcon, SunIcon, MoonIcon } from './components/icons/Icons';

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
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [games, setGames] = useState<Game[]>(MOCK_GAMES);
  const [championships, setChampionships] = useState<Championship[]>(MOCK_CHAMPIONSHIPS);
  const [tradeProposals, setTradeProposals] = useState<Trade[]>([]);
  const [activeView, setActiveView] = useState<View>('home');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [activeChampionshipId, setActiveChampionshipId] = useState<string | null>(null);
  const [activeTradingDate, setActiveTradingDate] = useState<string | null>(null);
  const [championshipFormMode, setChampionshipFormMode] = useState<'create' | 'edit'>('create');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLoginAsGuest = () => {
    setCurrentUser(GUEST_USER);
  };

  const handleLogin = (name: string, membershipNumber: string) => {
    const user = users.find(
      u => u.name.toLowerCase() === name.toLowerCase() && u.membershipNumber === membershipNumber
    );
    if (user) {
      setCurrentUser(user);
    } else {
      alert('Nome ou número do título inválido.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('home');
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
      if (id) { // Editing existing
        setActiveChampionshipId(id);
        setChampionshipFormMode('edit');
      } else { // Creating new
        setActiveChampionshipId(null);
        setChampionshipFormMode('create');
      }
    }
    
    setSidebarOpen(false); // Close sidebar on navigation
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

        // 1. Update the game that was just drawn
        sourceGame.status = 'finished';
        sourceGame.drawnPlayers = drawnIds;

        // 2. Find subsequent games on the same day
        const sameDayGames = gamesCopy
            .filter(g => g.date === sourceGame.date && g.id !== sourceGame.id && g.status !== 'finished')
            .sort((a, b) => a.time.localeCompare(b.time));

        // 3. Distribute remaining players
        let playersToDistribute = [...remainingIds];
        for (const nextGame of sameDayGames) {
            if (playersToDistribute.length === 0) break;
            const numToDraw = nextGame.maxPlayers || 20;
            const drawnForThisGame = playersToDistribute.splice(0, numToDraw);
            nextGame.drawnPlayers = drawnForThisGame;
            nextGame.status = 'finished'; 
        }

        // 4. Check if all games for this day are done to start trading period
        const allGamesForDay = gamesCopy.filter(g => g.date === sourceGame.date);
        const allFinished = allGamesForDay.every(g => g.status === 'finished');

        if (allFinished) {
            console.log(`All games for ${sourceGame.date} are finished. Starting trading window.`);
            const tradingEndTime = Date.now() + 30 * 60 * 1000;
            gamesCopy = gamesCopy.map(g => 
                g.date === sourceGame.date ? { ...g, tradingEndTime } : g
            );
        }
        return gamesCopy;
    });
  };

  const handleSaveChampionship = (championshipData: Omit<Championship, 'id' | 'teams'> | Championship) => {
    if ('id' in championshipData) { // Update
      setChampionships(prev => prev.map(c => c.id === championshipData.id ? {...c, ...championshipData} : c));
    } else { // Create
      const newChampionship: Championship = {
        ...championshipData,
        id: `champ${Date.now()}`,
        teams: [],
      };
      setChampionships(prev => [newChampionship, ...prev]);
    }
    navigateTo('championships');
  };

  const handleDeleteChampionship = (championshipId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este campeonato? Esta ação não pode ser desfeita.')) {
      setChampionships(prev => prev.filter(c => c.id !== championshipId));
      navigateTo('championships');
    }
  };
  
  const tradedPlayerIds = useMemo(() => 
    tradeProposals.filter(t => t.status === 'accepted').flatMap(t => [t.fromPlayerId, t.toPlayerId]), 
  [tradeProposals]);

  const handleProposeTrade = (toPlayerId: string) => {
    if (!currentUser) return;
    
    // Find the games involved
    const fromGame = games.find(g => g.drawnPlayers.includes(currentUser.id) && g.date === activeTradingDate);
    const toGame = games.find(g => g.drawnPlayers.includes(toPlayerId) && g.date === activeTradingDate);

    if (!fromGame || !toGame) {
      alert("Não foi possível encontrar os jogos para a troca.");
      return;
    }
    
    const newTrade: Trade = {
      id: `trade-${Date.now()}`,
      fromPlayerId: currentUser.id,
      toPlayerId: toPlayerId,
      fromGameId: fromGame.id,
      toGameId: toGame.id,
      status: 'pending',
    };
    setTradeProposals(prev => [...prev, newTrade]);
  };

  const handleRespondToTrade = (tradeId: string, response: 'accepted' | 'declined') => {
      const trade = tradeProposals.find(t => t.id === tradeId);
      if (!trade) return;

      if (response === 'declined') {
          setTradeProposals(prev => prev.filter(t => t.id !== tradeId));
          return;
      }
      
      if (response === 'accepted') {
          // Finalize trade
          setGames(prevGames => {
              const newGames = [...prevGames];
              const fromGame = newGames.find(g => g.id === trade.fromGameId);
              const toGame = newGames.find(g => g.id === trade.toGameId);

              if (fromGame && toGame) {
                  // Swap players
                  fromGame.drawnPlayers = fromGame.drawnPlayers.filter(id => id !== trade.fromPlayerId).concat(trade.toPlayerId);
                  toGame.drawnPlayers = toGame.drawnPlayers.filter(id => id !== trade.toPlayerId).concat(trade.fromPlayerId);
              }
              return newGames;
          });
          
          // Update this trade to accepted and remove all other pending trades involving these two players
// FIX: Explicitly set the return type of the map callback to `Trade` to prevent type widening of the `status` property.
          setTradeProposals(prev => prev.map((t): Trade => t.id === tradeId ? {...t, status: 'accepted'} : t)
            .filter(t => t.status === 'accepted' || (t.status === 'pending' && t.fromPlayerId !== trade.fromPlayerId && t.toPlayerId !== trade.fromPlayerId && t.fromPlayerId !== trade.toPlayerId && t.toPlayerId !== trade.toPlayerId))
          );
      }
  };


  const activeGame = useMemo(() => games.find(g => g.id === activeGameId), [games, activeGameId]);
  const activeChampionship = useMemo(() => championships.find(c => c.id === activeChampionshipId), [championships, activeChampionshipId]);
  const activeTradingGames = useMemo(() => games.filter(g => g.date === activeTradingDate), [games, activeTradingDate]);
  
  const activeTradingDates = useMemo(() => {
    const dates = new Set(games.filter(g => g.tradingEndTime && g.tradingEndTime > Date.now()).map(g => g.date));
    return Array.from(dates);
  }, [games]);

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} onLoginAsGuest={handleLoginAsGuest} theme={theme} onToggleTheme={toggleTheme} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <HomeScreen 
          games={games} 
          currentUser={currentUser} 
          onRegister={handleRegister} 
          onUnregister={handleUnregister}
          onNavigate={navigateTo} 
          users={users}
          activeTradingDates={activeTradingDates}
        />;
      case 'draw':
        return activeGame ? <DrawScreen game={activeGame} users={users} currentUser={currentUser} onDrawComplete={handleDrawComplete} /> : <p>Jogo não encontrado.</p>;
      case 'admin':
        return <AdminPanel 
          games={games} 
          users={users} 
          onNavigate={navigateTo}
          onStartDraw={handleStartDraw}
        />;
      case 'trading':
        return activeTradingDate && activeTradingGames.length > 0 ? (
          <TradingScreen 
            gamesForDay={activeTradingGames}
            users={users}
            currentUser={currentUser}
            tradeProposals={tradeProposals}
            tradedPlayerIds={tradedPlayerIds}
            onProposeTrade={handleProposeTrade}
            onRespondToTrade={handleRespondToTrade}
          />
        ) : <p>Nenhum período de trocas ativo.</p>;
      case 'history':
         return <ResultsScreen games={games} users={users} />;
      case 'championships':
         return <ChampionshipsScreen 
            championships={championships} 
            currentUser={currentUser}
            onNavigate={navigateTo}
          />;
      case 'championshipDetails':
        return activeChampionship ? (
            <ChampionshipDetailsScreen 
                championship={activeChampionship}
                currentUser={currentUser}
                onNavigate={navigateTo}
                onDelete={handleDeleteChampionship}
            />
        ) : <div className="text-center p-8"><h2 className="text-2xl font-bold">Campeonato não encontrado.</h2></div>;
      case 'championshipForm':
        return (
            <ChampionshipForm 
                mode={championshipFormMode}
                initialData={activeChampionship}
                onSave={handleSaveChampionship}
                onCancel={() => navigateTo(championshipFormMode === 'edit' && activeChampionshipId ? 'championshipDetails' : 'championships', activeChampionshipId || undefined)}
            />
        );
      case 'results': // Fallback for old navigation
        return <ResultsScreen games={games} users={users} />;
      case 'rules':
        return <div className="bg-white dark:bg-sidebar-bg p-6 rounded-lg text-center"><h2 className="text-2xl font-bold">Página de Regras</h2><p>Em construção.</p></div>
      case 'profile':
        return <div className="bg-white dark:bg-sidebar-bg p-6 rounded-lg text-center"><h2 className="text-2xl font-bold">Página de Perfil</h2><p>Em construção.</p></div>
      default:
        return <p>Página não encontrada.</p>;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-main-bg-light' : 'bg-main-bg-dark'} text-gray-800 dark:text-gray-200 font-sans flex`}>
      <Sidebar 
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
      
      <div className="flex-1 flex flex-col transition-all duration-300 md:ml-0">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 bg-white/80 dark:bg-main-bg-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700/50 flex items-center justify-between p-4">
          <button onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">
            <MenuIcon className="w-6 h-6" />
          </button>
           <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Mudar tema"
            >
              {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;


import React, { useState, useEffect, useMemo } from 'react';
import { Game, User } from '../types';
import PlayerAvatar from './PlayerAvatar';
import { CrownIcon, TrophyIcon, UsersIcon } from './icons/Icons';

interface DrawScreenProps {
  game: Game;
  users: User[];
  currentUser: User;
  onDrawComplete: (gameId: string, drawnPlayerIds: string[], remainingPlayerIds: string[]) => void;
}

// Fisher-Yates Shuffle algorithm
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const DrawScreen: React.FC<DrawScreenProps> = ({ game, users, currentUser, onDrawComplete }) => {
  const [revealedPlayers, setRevealedPlayers] = useState<User[]>([]);
  const [playerInSlot, setPlayerInSlot] = useState<User | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isDrawRunning, setIsDrawRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const registrants = useMemo(() => game.registrants.map(id => users.find(u => u.id === id)).filter(Boolean) as User[], [game.registrants, users]);
  const drawnPlayerObjects = useMemo(() => game.drawnPlayers.map(id => users.find(u => u.id === id)).filter(Boolean) as User[], [game.drawnPlayers, users]);

  useEffect(() => {
    // Reset state if game changes
    setRevealedPlayers([]);
    setPlayerInSlot(null);
    setCountdown(null);
    setIsDrawRunning(false);
    setIsComplete(false);
    
    if (game.status === 'finished') {
      setRevealedPlayers(drawnPlayerObjects);
      setIsComplete(true);
    } else if (game.status === 'drawing' && !isDrawRunning) {
      setCountdown(3);
      setIsDrawRunning(true);
    }
  }, [game.id, game.status, drawnPlayerObjects]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => (c !== null ? c - 1 : null)), 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0) {
      const playersToDraw = shuffleArray([...registrants]);
      const maxPlayers = game.maxPlayers || 20;
      const playersForThisGame = playersToDraw.slice(0, maxPlayers);
      const remainingPlayers = playersToDraw.slice(maxPlayers);

      let drawIndex = 0;

      const processNextPlayer = () => {
        if (drawIndex >= playersForThisGame.length) {
          setIsComplete(true);
          setPlayerInSlot(null);
          if (currentUser.role === 'admin') {
            onDrawComplete(game.id, playersForThisGame.map(p => p.id), remainingPlayers.map(p => p.id));
          }
          return;
        }

        const playerToReveal = playersForThisGame[drawIndex];
        let spinCount = 0;
        const spinInterval = setInterval(() => {
          setPlayerInSlot(registrants[Math.floor(Math.random() * registrants.length)]);
          spinCount++;
          if (spinCount >= 20) { // 2 seconds of spinning
            clearInterval(spinInterval);
            setPlayerInSlot(playerToReveal);
            setTimeout(() => {
              setRevealedPlayers(prev => [...prev, playerToReveal]);
              drawIndex++;
              setTimeout(processNextPlayer, 1000); // 1s pause after reveal, before next 3s cycle starts
            }, 1000); // 1 second to view the revealed player
          }
        }, 100);
      };
      
      processNextPlayer();
    }
  }, [countdown, game, registrants, currentUser.role, onDrawComplete]);

  const renderPreDraw = () => (
    <div className="text-center p-8">
      <h2 className="text-3xl font-bold mb-4">Inscritos para o Sorteio ({registrants.length})</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Aguardando o administrador iniciar o sorteio ao vivo.</p>
       <div className="flex flex-wrap justify-center gap-2 max-h-96 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {registrants.map(player => (
            <div key={player.id} className="text-center p-1">
              <PlayerAvatar user={player} size="sm" className="mx-auto" />
              <p className="mt-1 font-medium text-xs truncate w-16">{player.nickname}</p>
            </div>
          ))}
        </div>
    </div>
  );

  const renderCountdown = () => (
    <div className="flex flex-col items-center justify-center h-64">
        <p className="text-2xl text-gray-500 dark:text-gray-400 mb-4">Sorteio iniciando em...</p>
        <div className="text-9xl font-extrabold text-brand-blue animate-ping">{countdown}</div>
    </div>
  );

  const renderDrawing = () => (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-bold mb-4">Jogadores Sorteados ({revealedPlayers.length}/{game.maxPlayers || 20})</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg min-h-[200px]">
           {revealedPlayers.map(player => (
              <div key={player.id} className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md text-center animate-reveal">
                <PlayerAvatar user={player} size="md" className="mx-auto" />
                <p className="mt-2 font-semibold text-xs truncate">{player.nickname}</p>
              </div>
            ))}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-brand-blue/10 dark:bg-brand-blue/20 p-6 rounded-2xl">
         <h3 className="text-xl font-bold mb-4">{isComplete ? "Sorteio Finalizado!" : "Sorteando..."}</h3>
         <div className="w-40 h-40 rounded-full bg-white dark:bg-sidebar-bg flex items-center justify-center shadow-2xl">
            {playerInSlot ? (
                <PlayerAvatar user={playerInSlot} size="lg" />
            ) : isComplete ? (
                 <TrophyIcon className="w-20 h-20 text-green-500"/>
            ) : (
                <div className="w-16 h-16 border-4 border-t-brand-blue border-gray-200 dark:border-gray-600 rounded-full animate-spin"></div>
            )}
         </div>
         <p className="mt-4 font-bold text-2xl h-8">{playerInSlot?.nickname || ''}</p>
      </div>
    </div>
  );

  const renderFinished = () => (
    <div>
      <h2 className="text-4xl font-extrabold text-brand-blue dark:text-brand-blue-light mb-2 text-center">Sorteio Finalizado!</h2>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Estes são os {drawnPlayerObjects.length} selecionados para o jogo das {game.time}.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {drawnPlayerObjects.map(player => (
          <div key={player.id} className="relative bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md text-center animate-reveal">
            <PlayerAvatar user={player} size="lg" className="mx-auto" />
            <p className="mt-2 font-semibold text-sm truncate">{player.nickname}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{player.position}</p>
             {(game.captains || []).includes(player.id) && (
                <div className="absolute -top-2 -right-2 text-yellow-500">
                    <CrownIcon className="w-6 h-6" />
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderContent = () => {
    if (game.status === 'finished') {
        return renderFinished();
    }
    if (game.status === 'drawing' || isDrawRunning) {
        if(countdown && countdown > 0) return renderCountdown();
        return renderDrawing();
    }
    return renderPreDraw();
  };

  return (
    <div className="container mx-auto">
      <div className="bg-white dark:bg-sidebar-bg p-6 rounded-2xl shadow-xl">
        <h1 className="text-xl font-bold text-center mb-1 text-gray-800 dark:text-gray-100">Sorteio para o jogo de {game.date} às {game.time}</h1>
        <hr className="my-4 border-gray-200 dark:border-gray-700"/>
        {renderContent()}
      </div>
    </div>
  );
};

export default DrawScreen;

import React, { useState, useEffect, useMemo } from 'react';
import { Game, User, Trade } from '../types';
import { SwitchHorizontalIcon, CheckCircleIcon, ExclamationIcon } from './icons/Icons';
import PlayerAvatar from './PlayerAvatar';

const CountdownTimer: React.FC<{ endTime: number }> = ({ endTime }) => {
  const calculateTimeLeft = () => {
    const difference = endTime - +new Date();
    let timeLeft = { minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const isTimeUp = timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className={`text-4xl font-bold ${isTimeUp ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}>
      {isTimeUp ? "Encerrado" : `${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
    </div>
  );
};


interface TradingScreenProps {
  gamesForDay: Game[];
  users: User[];
  currentUser: User;
  tradeProposals: Trade[];
  tradedPlayerIds: string[];
  onProposeTrade: (toPlayerId: string) => void;
  onRespondToTrade: (tradeId: string, response: 'accepted' | 'declined') => void;
}

const TradingScreen: React.FC<TradingScreenProps> = ({
  gamesForDay,
  users,
  currentUser,
  tradeProposals,
  tradedPlayerIds,
  onProposeTrade,
  onRespondToTrade
}) => {
  const tradingEndTime = gamesForDay[0]?.tradingEndTime;
  
  const myGame = useMemo(() => gamesForDay.find(g => g.drawnPlayers.includes(currentUser.id)), [gamesForDay, currentUser.id]);

  const incomingProposals = useMemo(() =>
    tradeProposals.filter(t => t.toPlayerId === currentUser.id && t.status === 'pending'),
  [tradeProposals, currentUser.id]);
  
  const outgoingProposals = useMemo(() =>
    tradeProposals.filter(t => t.fromPlayerId === currentUser.id && t.status === 'pending'),
  [tradeProposals, currentUser.id]);

  const hasTraded = tradedPlayerIds.includes(currentUser.id);
  const isTimeUp = tradingEndTime ? tradingEndTime < Date.now() : true;

  const getUser = (id: string) => users.find(u => u.id === id);

  if (!tradingEndTime) {
    return <p>Período de trocas não está ativo.</p>;
  }
  
  return (
    <div className="space-y-8 animate-reveal">
      <div className="text-center p-6 bg-white dark:bg-sidebar-bg rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trocas Ao Vivo - {gamesForDay[0].date}</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Tempo restante para propor e aceitar trocas:</p>
        <div className="mt-4">
          <CountdownTimer endTime={tradingEndTime} />
        </div>
      </div>
      
      <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 rounded-r-lg flex items-center">
          <ExclamationIcon className="w-6 h-6 mr-3 flex-shrink-0" />
          <p className="text-sm font-medium">Lembrete: Cada jogador só pode realizar <strong>uma</strong> troca com sucesso. Todas as outras propostas serão canceladas.</p>
      </div>

      {/* Trade Proposals Section */}
      {(incomingProposals.length > 0 || outgoingProposals.length > 0) && (
        <div className="bg-white dark:bg-sidebar-bg p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Minhas Propostas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Incoming */}
            <div>
              <h3 className="font-semibold mb-2">Recebidas ({incomingProposals.length})</h3>
              <div className="space-y-3">
                {incomingProposals.map(trade => {
                   const fromPlayer = getUser(trade.fromPlayerId);
                   return fromPlayer ? (
                      <div key={trade.id} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex items-center justify-between">
                          <div className="flex items-center">
                            <PlayerAvatar user={fromPlayer} size="sm" />
                            <span className="ml-2 text-sm font-medium">{fromPlayer.nickname} quer trocar.</span>
                          </div>
                          {!hasTraded && !isTimeUp && (
                            <div className="flex space-x-2">
                                <button onClick={() => onRespondToTrade(trade.id, 'accepted')} className="px-3 py-1 text-xs font-bold text-white bg-green-500 rounded hover:bg-green-600">Aceitar</button>
                                <button onClick={() => onRespondToTrade(trade.id, 'declined')} className="px-3 py-1 text-xs font-bold text-white bg-red-500 rounded hover:bg-red-600">Recusar</button>
                            </div>
                          )}
                      </div>
                   ) : null
                })}
                {incomingProposals.length === 0 && <p className="text-sm text-gray-400">Nenhuma proposta recebida.</p>}
              </div>
            </div>
             {/* Outgoing */}
            <div>
              <h3 className="font-semibold mb-2">Enviadas ({outgoingProposals.length})</h3>
               <div className="space-y-3">
                {outgoingProposals.map(trade => {
                   const toPlayer = getUser(trade.toPlayerId);
                   return toPlayer ? (
                      <div key={trade.id} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex items-center justify-between">
                           <div className="flex items-center">
                                <PlayerAvatar user={toPlayer} size="sm" />
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Aguardando resposta de <strong>{toPlayer.nickname}</strong>.</span>
                           </div>
                           <button onClick={() => onRespondToTrade(trade.id, 'declined')} className="px-3 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Cancelar</button>
                      </div>
                   ) : null
                })}
                 {outgoingProposals.length === 0 && <p className="text-sm text-gray-400">Nenhuma proposta enviada.</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Games List */}
      <div className="space-y-6">
        {gamesForDay.sort((a,b) => a.time.localeCompare(b.time)).map(game => (
          <div key={game.id} className="bg-white dark:bg-sidebar-bg p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-brand-blue dark:text-brand-blue-light mb-4">Jogo das {game.time}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {game.drawnPlayers.map(playerId => {
                const player = getUser(playerId);
                if (!player) return null;
                
                const isCurrentUser = player.id === currentUser.id;
                const playerHasTraded = tradedPlayerIds.includes(player.id);
                const canPropose = !isCurrentUser && !hasTraded && !playerHasTraded && !isTimeUp;

                return (
                  <div key={player.id} className={`p-3 rounded-lg text-center transition-all ${isCurrentUser ? 'bg-brand-blue/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <PlayerAvatar user={player} size="md" className="mx-auto" />
                    <p className="mt-2 font-semibold text-sm truncate">{player.nickname}</p>
                    {isCurrentUser && <span className="text-xs font-bold text-brand-blue dark:text-brand-blue-light">VOCÊ</span>}
                    {playerHasTraded && <span className="text-xs font-bold text-green-500 flex items-center justify-center"><CheckCircleIcon className="w-4 h-4 mr-1"/>Trocado</span>}
                    {canPropose && myGame && myGame.id !== game.id && (
                       <button 
                         onClick={() => onProposeTrade(player.id)}
                         className="mt-2 w-full text-xs font-bold px-2 py-1 bg-brand-green text-white rounded hover:bg-brand-green-dark transition-colors"
                       >
                         <SwitchHorizontalIcon className="w-4 h-4 inline mr-1" />
                         Propor Troca
                       </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradingScreen;

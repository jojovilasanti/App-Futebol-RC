import React, { useState } from 'react';
import { User } from '../types';
import PlayerAvatar from './PlayerAvatar';
import { ArrowLeftIcon, CheckCircleIcon, FireIcon, ShieldCheckIcon, BoltIcon, ForwardIcon } from './icons/Icons';

interface RatingScreenProps {
  currentUser: User;
  playersToRate: User[];
  onRatePlayers: (ratings: Record<string, { attack: number; defense: number; speed: number; passing: number; }>) => void;
  onCancel: () => void;
}

type Ratings = Record<string, {
    attack: number;
    defense: number;
    speed: number;
    passing: number;
}>;

const AttributeSlider: React.FC<{
    label: string;
    icon: React.ReactNode;
    value: number;
    onChange: (value: number) => void;
}> = ({ label, icon, value, onChange }) => (
    <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
            <label className="flex items-center font-medium text-gray-700 dark:text-gray-300">
                {icon}
                <span className="ml-2">{label}</span>
            </label>
            <span className="font-bold text-brand-blue dark:text-brand-blue-light w-8 text-center">{value}</span>
        </div>
        <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider-thumb"
        />
        <style>{`
            .slider-thumb::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                background: #2563eb;
                cursor: pointer;
                border-radius: 50%;
            }
            .slider-thumb::-moz-range-thumb {
                width: 20px;
                height: 20px;
                background: #2563eb;
                cursor: pointer;
                border-radius: 50%;
            }
        `}</style>
    </div>
);


const RatingScreen: React.FC<RatingScreenProps> = ({ currentUser, playersToRate, onRatePlayers, onCancel }) => {
  const [ratings, setRatings] = useState<Ratings>(() => {
    const initialRatings: Ratings = {};
    playersToRate.forEach(player => {
      initialRatings[player.id] = { attack: 5, defense: 5, speed: 5, passing: 5 };
    });
    return initialRatings;
  });

  const handleRatingChange = (playerId: string, attribute: keyof Ratings[string], value: number) => {
    setRatings(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [attribute]: value
      }
    }));
  };

  const handleSubmit = () => {
    if (window.confirm('Tem certeza que deseja enviar suas avaliações? Esta ação não pode ser desfeita.')) {
        onRatePlayers(ratings);
    }
  };

  if (playersToRate.length === 0) {
    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold">Nenhum jogador para avaliar.</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Parece que você não participou do último jogo ou não haviam outros jogadores.</p>
            <button onClick={onCancel} className="mt-4 flex items-center mx-auto px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue-light transition-colors">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Voltar ao Perfil
            </button>
        </div>
    )
  }

  return (
    <div className="space-y-6 animate-reveal">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Avaliar Jogadores</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Dê notas de 0 a 10 para o desempenho dos seus colegas no último jogo.</p>
        </div>
        <button onClick={onCancel} className="hidden sm:flex items-center px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue-light transition-colors">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Voltar ao Perfil
        </button>
      </div>

      <div className="space-y-4">
        {playersToRate.map(player => (
          <div key={player.id} className="bg-white dark:bg-sidebar-bg p-5 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <PlayerAvatar user={player} size="md" />
              <div className="ml-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{player.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{player.nickname}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
               <AttributeSlider label="Ataque" icon={<FireIcon className="w-5 h-5 text-red-500"/>} value={ratings[player.id].attack} onChange={(v) => handleRatingChange(player.id, 'attack', v)} />
               <AttributeSlider label="Defesa" icon={<ShieldCheckIcon className="w-5 h-5 text-blue-500"/>} value={ratings[player.id].defense} onChange={(v) => handleRatingChange(player.id, 'defense', v)} />
               <AttributeSlider label="Velocidade" icon={<BoltIcon className="w-5 h-5 text-yellow-500"/>} value={ratings[player.id].speed} onChange={(v) => handleRatingChange(player.id, 'speed', v)} />
               <AttributeSlider label="Passe" icon={<ForwardIcon className="w-5 h-5 text-green-500"/>} value={ratings[player.id].passing} onChange={(v) => handleRatingChange(player.id, 'passing', v)} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={handleSubmit} className="flex items-center justify-center w-full md:w-auto px-6 py-3 bg-brand-green text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-dark transition-colors">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            Enviar Avaliações
        </button>
      </div>
    </div>
  );
};

export default RatingScreen;

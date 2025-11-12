import React, { useState } from 'react';
import { Game } from '../types';

interface GameFormProps {
  onSave: (data: Omit<Game, 'id' | 'registrants' | 'drawnPlayers' | 'status' | 'captains'>) => void;
  onCancel: () => void;
}

const GameForm: React.FC<GameFormProps> = ({ onSave, onCancel }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('20');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date,
      time,
      maxPlayers: parseInt(maxPlayers, 10),
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-reveal">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Criar Novo Jogo
      </h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-sidebar-bg p-8 rounded-2xl shadow-lg space-y-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Data do Jogo
          </label>
          <input
            id="date"
            type="text"
            required
            className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-base"
            placeholder="DD/MM/AAAA"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Horário
            </label>
            <input
              id="time"
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-base"
              placeholder="HH:MM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="maxPlayers" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Máx. Jogadores (por jogo)
            </label>
            <input
              id="maxPlayers"
              type="number"
              required
              className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-base"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-sidebar-bg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-light dark:focus:ring-offset-gray-900 transition-colors"
            >
              Salvar Jogo
            </button>
        </div>
      </form>
    </div>
  );
};

export default GameForm;
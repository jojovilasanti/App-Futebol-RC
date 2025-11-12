
import React, { useState, useEffect } from 'react';
import { Championship, ChampionshipStatus } from '../types';

interface ChampionshipFormProps {
  mode: 'create' | 'edit';
  initialData?: Championship | null;
  onSave: (data: Omit<Championship, 'id' | 'teams'> | Championship) => void;
  onCancel: () => void;
}

const ChampionshipForm: React.FC<ChampionshipFormProps> = ({ mode, initialData, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState<ChampionshipStatus>('upcoming');

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setDate(initialData.date);
      setTime(initialData.time);
      setStatus(initialData.status);
    }
  }, [mode, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const championshipData = { name, description, date, time, status };
    if (mode === 'edit' && initialData) {
      onSave({ ...championshipData, id: initialData.id });
    } else {
      onSave(championshipData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-reveal">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {mode === 'create' ? 'Criar Novo Campeonato' : 'Editar Campeonato'}
      </h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-sidebar-bg p-8 rounded-2xl shadow-lg space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome do Campeonato
          </label>
          <input
            id="name"
            type="text"
            required
            className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-base"
            placeholder="Ex: Copa Rádio Clube - Verão 2024"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            rows={4}
            required
            className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-base"
            placeholder="Descreva o campeonato, regras, formato, etc."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data de Início
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
        </div>
        <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
            </label>
            <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ChampionshipStatus)}
                className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue text-base"
            >
                <option value="upcoming">Em Breve</option>
                <option value="ongoing">Em Andamento</option>
                <option value="finished">Finalizado</option>
            </select>
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
              Salvar Campeonato
            </button>
        </div>
      </form>
    </div>
  );
};

export default ChampionshipForm;

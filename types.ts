// Fix: Import React to resolve "Cannot find namespace 'React'" error.
import React from 'react';

export interface User {
  id: string;
  name: string;
  nickname: string;
  position: 'Goleiro' | 'Zagueiro' | 'Lateral' | 'Meio-campo' | 'Atacante';
  avatarUrl: string;
  membershipNumber: string;
  role: 'member' | 'admin' | 'guest';
  goals: number;
  status?: 'active' | 'pending';
  email?: string;
  
  // Game profile fields
  rating?: number; // 1-5 stars from overall performance, can be calculated
  level?: number;
  xp?: number;
  attributes?: {
    attack: { score: number; count: number };
    defense: { score: number; count: number };
    speed: { score: number; count: number };
    passing: { score: number; count: number };
  };
  achievements?: string[];
  favoriteTeam?: string;
  physicalCondition?: 'Excelente' | 'Bom' | 'Regular' | 'Lesionado';
}

export type GameStatus = 'open' | 'closed' | 'drawing' | 'finished';

export interface Game {
  id: string;
  date: string;
  time: string;
  status: GameStatus;
  registrants: string[];
  drawnPlayers: string[];
  captains?: string[];
  maxPlayers?: number;
  tradingEndTime?: number; // Timestamp for when trading ends
}

export type ChampionshipStatus = 'upcoming' | 'ongoing' | 'finished';

export interface Championship {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  status: ChampionshipStatus;
  teams?: string[];
}

export interface Trade {
  id: string;
  fromPlayerId: string;
  toPlayerId: string;
  fromGameId: string;
  toGameId: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface Invitation {
  id: string;
  email: string;
  status: 'sent' | 'registered';
  sentAt: Date;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}


export type View = 'home' | 'draw' | 'admin' | 'results' | 'history' | 'rules' | 'profile' | 'championships' | 'championshipDetails' | 'championshipForm' | 'trading' | 'rating' | 'gameForm';
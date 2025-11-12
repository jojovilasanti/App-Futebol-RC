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

export type View = 'home' | 'draw' | 'admin' | 'results' | 'history' | 'rules' | 'profile' | 'championships' | 'championshipDetails' | 'championshipForm' | 'trading';
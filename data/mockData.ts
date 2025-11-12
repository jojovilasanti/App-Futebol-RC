import { User, Game, Championship } from '../types';

export const MOCK_USERS: User[] = [
  { 
    id: '6', 
    name: 'Admin', 
    nickname: 'Admin', 
    position: 'Atacante', 
    avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=1d4ed8&color=fff', 
    membershipNumber: 'admin', 
    role: 'admin', 
    goals: 0, 
    status: 'active', 
    email: 'admin@radioclube.com', 
    rating: 5, 
    level: 1, 
    xp: 0, 
    attributes: {
        attack: { score: 0, count: 0 },
        defense: { score: 0, count: 0 },
        speed: { score: 0, count: 0 },
        passing: { score: 0, count: 0 },
    }, 
    favoriteTeam: 'N/A', 
    physicalCondition: 'Excelente' 
  },
];

const today = new Date();

const getNextDayOfWeek = (date: Date, dayOfWeek: number) => {
    const resultDate = new Date(date.getTime());
    resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
    return resultDate;
}

const nextWednesday = getNextDayOfWeek(today, 3);
const nextSaturday = getNextDayOfWeek(today, 6);

export const MOCK_GAMES: Game[] = [
  {
    id: 'wed1',
    date: nextWednesday.toLocaleDateString('pt-BR'),
    time: '17:30',
    status: 'open',
    registrants: [],
    drawnPlayers: [],
    captains: [],
    maxPlayers: 20,
  },
  {
    id: 'wed2',
    date: nextWednesday.toLocaleDateString('pt-BR'),
    time: '18:30',
    status: 'open',
    registrants: [],
    drawnPlayers: [],
    captains: [],
    maxPlayers: 20,
  },
  {
    id: 'sat1',
    date: nextSaturday.toLocaleDateString('pt-BR'),
    time: '15:30',
    status: 'open',
    registrants: [],
    drawnPlayers: [],
    captains: [],
    maxPlayers: 20,
  },
  {
    id: 'sat2',
    date: nextSaturday.toLocaleDateString('pt-BR'),
    time: '16:30',
    status: 'open',
    registrants: [],
    drawnPlayers: [],
    captains: [],
    maxPlayers: 20,
  },
  {
    id: 'sat3',
    date: nextSaturday.toLocaleDateString('pt-BR'),
    time: '17:30',
    status: 'open',
    registrants: [],
    drawnPlayers: [],
    captains: [],
    maxPlayers: 20,
  }
];

export const MOCK_CHAMPIONSHIPS: Championship[] = [];

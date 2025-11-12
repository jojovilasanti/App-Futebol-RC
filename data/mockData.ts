import { User, Game, Championship } from '../types';

const generateRandomAttributes = () => ({
  attack: Math.floor(Math.random() * 50) + 50, // 50-99
  defense: Math.floor(Math.random() * 50) + 50,
  speed: Math.floor(Math.random() * 50) + 50,
  passing: Math.floor(Math.random() * 50) + 50,
  dribbling: Math.floor(Math.random() * 50) + 50,
});

export const MOCK_USERS: User[] = [
  { id: '6', name: 'Admin', nickname: 'Admin', position: 'Atacante', avatarUrl: 'https://picsum.photos/seed/6/200', membershipNumber: 'admin', role: 'admin', goals: 0, status: 'active', email: 'admin@radioclube.com', rating: 5, level: 99, xp: 100, attributes: generateRandomAttributes() },
  { id: '1', name: 'Carlos Alberto', nickname: 'Carlão', position: 'Zagueiro', avatarUrl: 'https://picsum.photos/seed/1/200', membershipNumber: '1001', role: 'member', goals: 5, status: 'active', email: 'carlos.alberto@example.com', rating: 4.5, level: 12, xp: 50, attributes: generateRandomAttributes() },
  { id: '2', name: 'Roberto Silva', nickname: 'Beto', position: 'Atacante', avatarUrl: 'https://picsum.photos/seed/2/200', membershipNumber: '1002', role: 'member', goals: 25, status: 'active', email: 'roberto.silva@example.com', rating: 4.8, level: 25, xp: 80, attributes: generateRandomAttributes(), achievements: ['top_scorer'] },
  { id: '3', name: 'João Pereira', nickname: 'JP', position: 'Meio-campo', avatarUrl: 'https://picsum.photos/seed/3/200', membershipNumber: '1003', role: 'member', goals: 12, status: 'active', email: 'joao.pereira@example.com', rating: 4.2, level: 18, xp: 20, attributes: generateRandomAttributes() },
  { id: '4', name: 'Fernando Lima', nickname: 'Fernandinho', position: 'Lateral', avatarUrl: 'https://picsum.photos/seed/4/200', membershipNumber: '1004', role: 'member', goals: 8, status: 'active', email: 'fernando.lima@example.com', rating: 3.9, level: 15, xp: 90, attributes: generateRandomAttributes() },
  { id: '5', name: 'André Marques', nickname: 'Deko', position: 'Goleiro', avatarUrl: 'https://picsum.photos/seed/5/200', membershipNumber: '1005', role: 'member', goals: 1, status: 'active', email: 'andre.marques@example.com', rating: 4.6, level: 22, xp: 30, attributes: generateRandomAttributes() },
  { id: '72', name: 'Pedro Novo', nickname: 'Pedrinho', position: 'Atacante', avatarUrl: 'https://picsum.photos/seed/72/200', membershipNumber: '3001', role: 'member', goals: 0, status: 'pending', email: 'pedro.novo@example.com' },
  { id: '73', name: 'Mariana Costa', nickname: 'Mari', position: 'Meio-campo', avatarUrl: 'https://picsum.photos/seed/73/200', membershipNumber: '3002', role: 'member', goals: 0, status: 'pending', email: 'mariana.costa@example.com' },
  ...Array.from({ length: 65 }, (_, i) => ({
    id: `${i + 7}`,
    name: `Jogador ${i + 7}`,
    nickname: `Nick${i + 7}`,
    position: (['Atacante', 'Meio-campo', 'Zagueiro', 'Lateral', 'Goleiro'] as const)[i % 5],
    avatarUrl: `https://picsum.photos/seed/${i + 7}/200`,
    membershipNumber: `${2000 + i}`,
    role: 'member' as 'member',
    goals: Math.floor(Math.random() * 20),
    status: 'active' as 'active',
    email: `jogador${i+7}@example.com`,
    rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // 3.5 to 5.0
    level: Math.floor(Math.random() * 30) + 1,
    xp: Math.floor(Math.random() * 100),
    attributes: generateRandomAttributes(),
    achievements: i > 50 ? ['veteran'] : []
  }))
];

const today = new Date();

// Function to get the next occurrence of a day of the week (0=Sun, 1=Mon, ..., 6=Sat)
// If today is the day, it returns today.
const getNextDayOfWeek = (date: Date, dayOfWeek: number) => {
    const resultDate = new Date(date.getTime());
    resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
    return resultDate;
}

// Function to get the most recent past game day (Wednesday or Saturday)
const getPreviousGameDay = (date: Date) => {
    const today = new Date(date); // Create a copy to avoid mutation
    const currentDay = today.getDay(); // 0=Sun, ..., 3=Wed, ..., 6=Sat

    let daysSinceWednesday = (currentDay - 3 + 7) % 7;
    if (daysSinceWednesday === 0) daysSinceWednesday = 7; 

    let daysSinceSaturday = (currentDay - 6 + 7) % 7;
    if (daysSinceSaturday === 0) daysSinceSaturday = 7;

    const lastWednesday = new Date(today);
    lastWednesday.setDate(today.getDate() - daysSinceWednesday);

    const lastSaturday = new Date(today);
    lastSaturday.setDate(today.getDate() - daysSinceSaturday);

    // Return the more recent of the two dates
    return lastWednesday > lastSaturday ? lastWednesday : lastSaturday;
};


const nextWednesday = getNextDayOfWeek(today, 3);
const nextSaturday = getNextDayOfWeek(today, 6);
const previousGameDate = getPreviousGameDay(new Date());


export const MOCK_GAMES: Game[] = [
  // Wednesday Games - 2 games possible
  {
    id: 'wed1',
    date: nextWednesday.toLocaleDateString('pt-BR'),
    time: '17:30',
    status: 'open',
    registrants: MOCK_USERS.slice(0, 45).map(u => u.id), // All Wednesday players register here
    drawnPlayers: [],
    captains: [],
    maxPlayers: 20,
  },
  {
    id: 'wed2',
    date: nextWednesday.toLocaleDateString('pt-BR'),
    time: '18:30',
    status: 'open',
    registrants: [], // This will be filled by the draw
    drawnPlayers: [],
    captains: [],
    maxPlayers: 20,
  },
  // Saturday Games - 3 games possible
  {
    id: 'sat1',
    date: nextSaturday.toLocaleDateString('pt-BR'),
    time: '15:30',
    status: 'open',
    registrants: MOCK_USERS.map(u => u.id), // All Saturday players register here
    drawnPlayers: [],
    captains: [],
    maxPlayers: 20,
  },
  {
    id: 'sat2',
    date: nextSaturday.toLocaleDateString('pt-BR'),
    time: '16:30',
    status: 'open',
    registrants: [], // This will be filled by the draw
    drawnPlayers: [],
    captains: [],
    maxPlayers: 20,
  },
  {
    id: 'sat3',
    date: nextSaturday.toLocaleDateString('pt-BR'),
    time: '17:30',
    status: 'open',
    registrants: [], // This will be filled by the draw
    drawnPlayers: [],
    captains: [],
    maxPlayers: 20,
  },
  // Previous Game
  {
    id: 'prev1',
    date: previousGameDate.toLocaleDateString('pt-BR'),
    time: '17:30',
    status: 'finished',
    registrants: MOCK_USERS.slice(5, 30).map(u => u.id),
    drawnPlayers: MOCK_USERS.slice(5, 25).map(u => u.id),
    captains: ['2', '3'],
    maxPlayers: 20,
  }
];

export const MOCK_CHAMPIONSHIPS: Championship[] = [
  {
    id: 'champ1',
    name: 'Copa Rádio Clube - Verão 2024',
    description: 'O tradicional campeonato de verão está de volta! Monte seu time e participe.',
    date: '20/07/2024',
    time: '09:00',
    status: 'upcoming',
  },
  {
    id: 'champ2',
    name: 'Torneio Interno de Aniversário',
    description: 'Comemore o aniversário do clube jogando o que você mais ama.',
    date: '15/08/2024',
    time: '10:00',
    status: 'upcoming',
  },
  {
    id: 'champ3',
    name: 'Campeonato Master 40+',
    description: 'A experiência em campo! Exclusivo para sócios acima de 40 anos.',
    date: '01/05/2024',
    time: '15:00',
    status: 'finished',
  }
];
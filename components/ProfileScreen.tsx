
import React, { useMemo } from 'react';
import { User, Game, Achievement } from '../types';
import { StarIcon, TrophyIcon, CrownIcon, ShieldCheckIcon, FireIcon, HandThumbUpIcon, BoltIcon, ForwardIcon } from './icons/Icons';

interface ProfileScreenProps {
  user: User;
  games: Game[];
}

const ALL_ACHIEVEMENTS: Achievement[] = [
    { id: 'first_game', name: 'Estreante', description: 'Jogou sua primeira partida.', icon: HandThumbUpIcon },
    { id: 'veteran', name: 'Veterano', description: 'Jogou mais de 50 partidas.', icon: ShieldCheckIcon },
    { id: 'top_scorer', name: 'Artilheiro', description: 'Marcou mais de 20 gols.', icon: FireIcon },
    { id: 'captain', name: 'Capitão Nato', description: 'Foi capitão 5 ou mais vezes.', icon: CrownIcon },
];

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex items-center">
    <div className="p-3 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue dark:text-brand-blue-light mr-4">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
    </div>
  </div>
);

const AttributeMeter: React.FC<{ label: string; value: number; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
                {icon}
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 ml-2">{label}</span>
            </div>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{value}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-brand-blue h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
        </div>
    </div>
);


const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, games }) => {

    const userStats = useMemo(() => {
        const finishedGames = games.filter(g => g.status === 'finished');
        const participations = finishedGames.filter(g => g.drawnPlayers.includes(user.id)).length;
        const captaincies = finishedGames.filter(g => (g.captains || []).includes(user.id)).length;
        
        const xpForNextLevel = 100;
        const level = Math.floor(participations / 5) + 1;
        const xp = (participations % 5) * (100/5);
        
        return { participations, captaincies, level, xp, xpForNextLevel };
    }, [user, games]);

    const unlockedAchievements = useMemo(() => {
        const achievements: Achievement[] = [];
        if (userStats.participations >= 1) achievements.push(ALL_ACHIEVEMENTS[0]);
        if (userStats.participations >= 50) achievements.push(ALL_ACHIEVEMENTS[1]);
        if (user.goals >= 20) achievements.push(ALL_ACHIEVEMENTS[2]);
        if (userStats.captaincies >= 5) achievements.push(ALL_ACHIEVEMENTS[3]);
        // Add user's pre-defined achievements
        (user.achievements || []).forEach(achId => {
            if (!achievements.find(a => a.id === achId)) {
                const achievement = ALL_ACHIEVEMENTS.find(a => a.id === achId);
                if (achievement) achievements.push(achievement);
            }
        });
        return achievements;
    }, [user.goals, user.achievements, userStats]);


  return (
    <div className="space-y-8 animate-reveal">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Seu Perfil de Jogador</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Evolua seu desempenho e ganhe novas conquistas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Player Card & Stats */}
        <div className="lg:col-span-1 space-y-8">
            {/* Player Card */}
            <div className="bg-white dark:bg-sidebar-bg p-6 rounded-2xl shadow-lg text-center">
                <img src={user.avatarUrl} alt={user.nickname} className="w-32 h-32 rounded-full mx-auto border-4 border-brand-blue shadow-md" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-brand-blue dark:text-brand-blue-light font-semibold">@{user.nickname}</p>
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold text-yellow-500">Nível {userStats.level}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{userStats.xp}% para o próximo nível</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${userStats.xp}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Reputation */}
            <div className="bg-white dark:bg-sidebar-bg p-6 rounded-2xl shadow-lg">
                <h3 className="font-bold text-lg mb-3">Reputação</h3>
                <div className="flex items-center justify-center">
                    <span className="text-3xl font-bold mr-3">{user.rating?.toFixed(1) || 'N/A'}</span>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`w-7 h-7 ${ (user.rating || 0) > i ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                        ))}
                    </div>
                </div>
                 <button className="mt-4 w-full text-sm font-semibold px-4 py-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Avaliar último jogo
                 </button>
            </div>
        </div>

        {/* Right Column - Attributes, Career, Achievements */}
        <div className="lg:col-span-2 space-y-8">
            {/* Career Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={<TrophyIcon className="w-6 h-6"/>} label="Participações" value={userStats.participations} />
                <StatCard icon={<FireIcon className="w-6 h-6"/>} label="Gols" value={user.goals} />
                <StatCard icon={<CrownIcon className="w-6 h-6"/>} label="Capitão" value={userStats.captaincies} />
            </div>

             {/* Attributes */}
            <div className="bg-white dark:bg-sidebar-bg p-6 rounded-2xl shadow-lg">
                 <h3 className="font-bold text-lg mb-4">Atributos</h3>
                 <div className="space-y-4">
                     <AttributeMeter label="Ataque" value={user.attributes?.attack || 75} icon={<FireIcon className="w-5 h-5 text-red-500"/>} />
                     <AttributeMeter label="Defesa" value={user.attributes?.defense || 80} icon={<ShieldCheckIcon className="w-5 h-5 text-blue-500"/>} />
                     <AttributeMeter label="Velocidade" value={user.attributes?.speed || 88} icon={<BoltIcon className="w-5 h-5 text-yellow-500"/>} />
                     <AttributeMeter label="Passe" value={user.attributes?.passing || 82} icon={<ForwardIcon className="w-5 h-5 text-green-500"/>} />
                 </div>
            </div>
            
            {/* Achievements */}
            <div className="bg-white dark:bg-sidebar-bg p-6 rounded-2xl shadow-lg">
                <h3 className="font-bold text-lg mb-4">Conquistas ({unlockedAchievements.length}/{ALL_ACHIEVEMENTS.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {ALL_ACHIEVEMENTS.map(ach => {
                        const isUnlocked = unlockedAchievements.some(unlocked => unlocked.id === ach.id);
                        return (
                            <div key={ach.id} className={`p-4 rounded-lg text-center transition-all ${isUnlocked ? 'bg-amber-100 dark:bg-yellow-900/50' : 'bg-gray-100 dark:bg-gray-800 opacity-50'}`}>
                                <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full ${isUnlocked ? 'bg-amber-400 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                                   <ach.icon className="w-7 h-7" />
                                </div>
                                <p className={`mt-2 text-sm font-bold ${isUnlocked ? 'text-amber-800 dark:text-amber-200' : 'text-gray-600 dark:text-gray-400'}`}>{ach.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{ach.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { User, Game, Achievement, View } from '../types';
import { StarIcon, TrophyIcon, CrownIcon, ShieldCheckIcon, FireIcon, HandThumbUpIcon, BoltIcon, ForwardIcon, PencilSquareIcon, HeartIcon, PlusCircleIcon, CheckCircleIcon, RunningIcon } from './icons/Icons';

interface ProfileScreenProps {
  user: User;
  games: Game[];
  onUpdateProfile: (updatedUserData: Partial<User>) => void;
  onNavigate: (view: View) => void;
  hasLastGameToRate: boolean;
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
            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{value.toFixed(0)}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-brand-blue h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

const getPhysicalConditionInfo = (condition?: User['physicalCondition']) => {
    const runningIcon = <RunningIcon className="w-4 h-4 mr-1.5" />;
    switch (condition) {
        case 'Excelente': return { text: 'Excelente', color: 'bg-green-500', icon: runningIcon };
        case 'Bom': return { text: 'Bom', color: 'bg-blue-500', icon: runningIcon };
        case 'Regular': return { text: 'Regular', color: 'bg-yellow-500', icon: runningIcon };
        case 'Lesionado': return { text: 'Lesionado', color: 'bg-red-500', icon: <PlusCircleIcon className="w-4 h-4 mr-1.5" /> };
        default: return { text: 'N/A', color: 'bg-gray-500', icon: <PlusCircleIcon className="w-4 h-4 mr-1.5" /> };
    }
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, games, onUpdateProfile, onNavigate, hasLastGameToRate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableUser, setEditableUser] = useState<Partial<User>>(user);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setEditableUser(user);
    }, [user]);
    
    const handleSave = () => {
        onUpdateProfile(editableUser);
        setIsEditing(false);
    };
    
    const handleCancel = () => {
        setEditableUser(user);
        setIsEditing(false);
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditableUser({ ...editableUser, avatarUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarClick = () => {
        if (isEditing) {
            fileInputRef.current?.click();
        }
    };

    const userStats = useMemo(() => {
        const finishedGames = games.filter(g => g.status === 'finished');
        const participations = finishedGames.filter(g => g.drawnPlayers.includes(user.id)).length;
        const captaincies = finishedGames.filter(g => (g.captains || []).includes(user.id)).length;
        const xpForNextLevel = 100;
        const level = Math.floor(participations / 5) + 1;
        const xp = (participations % 5) * (100 / 5);
        return { participations, captaincies, level, xp, xpForNextLevel };
    }, [user, games]);

    const unlockedAchievements = useMemo(() => {
        const achievements: Achievement[] = [];
        if (userStats.participations >= 1) achievements.push(ALL_ACHIEVEMENTS[0]);
        if (userStats.participations >= 50) achievements.push(ALL_ACHIEVEMENTS[1]);
        if (user.goals >= 20) achievements.push(ALL_ACHIEVEMENTS[2]);
        if (userStats.captaincies >= 5) achievements.push(ALL_ACHIEVEMENTS[3]);
        (user.achievements || []).forEach(achId => {
            if (!achievements.find(a => a.id === achId)) {
                const achievement = ALL_ACHIEVEMENTS.find(a => a.id === achId);
                if (achievement) achievements.push(achievement);
            }
        });
        return achievements;
    }, [user.goals, user.achievements, userStats]);

    const getAttributeValue = (attr?: { score: number; count: number }) => {
        if (!attr || attr.count === 0) return 0;
        return attr.score / attr.count;
    }

    const conditionInfo = getPhysicalConditionInfo(user.physicalCondition);

    return (
        <div className="space-y-8 animate-reveal">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Seu Perfil de Jogador</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Evolua seu desempenho e ganhe novas conquistas.</p>
                </div>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center justify-center px-5 py-3 bg-brand-blue text-white font-semibold rounded-lg shadow-md hover:bg-brand-blue-dark transition-colors">
                        <PencilSquareIcon className="w-5 h-5 mr-2" />
                        Editar Perfil
                    </button>
                ) : (
                    <div className="flex space-x-2">
                         <button onClick={handleCancel} className="px-5 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors">Cancelar</button>
                         <button onClick={handleSave} className="px-5 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors">Salvar</button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white dark:bg-sidebar-bg p-6 rounded-2xl shadow-lg text-center">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                        <img 
                            src={editableUser.avatarUrl} 
                            alt={editableUser.nickname} 
                            className={`w-32 h-32 rounded-full mx-auto border-4 border-brand-blue shadow-md object-cover ${isEditing ? 'cursor-pointer hover:opacity-80' : ''}`}
                            onClick={handleAvatarClick}
                        />
                        {isEditing ? (
                             <input type="text" name="name" value={editableUser.name} onChange={handleChange} placeholder="Nome Completo" className="mt-4 w-full text-center appearance-none text-2xl font-bold rounded-md px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                        ) : (
                             <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                        )}
                        {isEditing ? (
                            <input type="text" name="nickname" value={editableUser.nickname} onChange={handleChange} placeholder="Apelido" className="mt-1 w-full text-center appearance-none rounded-md px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                        ) : (
                            <p className="text-brand-blue dark:text-brand-blue-light font-semibold">@{user.nickname}</p>
                        )}
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
                    
                    {isEditing ? (
                        <div className="bg-white dark:bg-sidebar-bg p-6 rounded-2xl shadow-lg space-y-4">
                            <div><label className="text-sm font-medium">Posição</label><select name="position" value={editableUser.position} onChange={handleChange} className="mt-1 w-full appearance-none rounded-md px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"><option>Atacante</option><option>Meio-campo</option><option>Zagueiro</option><option>Lateral</option><option>Goleiro</option></select></div>
                            <div><label className="text-sm font-medium">Time do Coração</label><input type="text" name="favoriteTeam" value={editableUser.favoriteTeam} onChange={handleChange} className="mt-1 w-full appearance-none rounded-md px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-blue" /></div>
                            <div><label className="text-sm font-medium">Condição Física</label><select name="physicalCondition" value={editableUser.physicalCondition} onChange={handleChange} className="mt-1 w-full appearance-none rounded-md px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"><option>Excelente</option><option>Bom</option><option>Regular</option><option>Lesionado</option></select></div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-sidebar-bg p-6 rounded-2xl shadow-lg space-y-4">
                            <div className="flex items-center"><HeartIcon className="w-5 h-5 text-red-500 mr-3" /><span className="text-sm font-medium text-gray-500 dark:text-gray-400">Time do Coração:</span><span className="ml-auto font-bold">{user.favoriteTeam || 'N/A'}</span></div>
                            <div className="flex items-center"><div className={`text-xs font-bold text-white px-2 py-1 rounded-full flex items-center ${conditionInfo.color}`}>{conditionInfo.icon} {conditionInfo.text}</div><span className="ml-auto font-bold">{user.position}</span></div>
                        </div>
                    )}
                    
                    <div className="bg-white dark:bg-sidebar-bg p-6 rounded-2xl shadow-lg">
                        <h3 className="font-bold text-lg mb-3">Reputação da Comunidade</h3>
                        {hasLastGameToRate ? (
                           <button onClick={() => onNavigate('rating')} className="w-full text-sm font-semibold px-4 py-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            Avaliar último jogo
                           </button>
                        ) : (
                            <p className="text-sm text-center text-gray-500 dark:text-gray-400">Jogue uma partida para poder avaliar outros jogadores.</p>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard icon={<TrophyIcon className="w-6 h-6"/>} label="Participações" value={userStats.participations} />
                        <StatCard icon={<FireIcon className="w-6 h-6"/>} label="Gols" value={user.goals} />
                        <StatCard icon={<CrownIcon className="w-6 h-6"/>} label="Capitão" value={userStats.captaincies} />
                    </div>
                    <div className="bg-white dark:bg-sidebar-bg p-6 rounded-2xl shadow-lg">
                        <h3 className="font-bold text-lg mb-4">Atributos</h3>
                        <div className="space-y-4">
                            <AttributeMeter label="Ataque" value={getAttributeValue(user.attributes?.attack)} icon={<FireIcon className="w-5 h-5 text-red-500"/>} />
                            <AttributeMeter label="Defesa" value={getAttributeValue(user.attributes?.defense)} icon={<ShieldCheckIcon className="w-5 h-5 text-blue-500"/>} />
                            <AttributeMeter label="Velocidade" value={getAttributeValue(user.attributes?.speed)} icon={<BoltIcon className="w-5 h-5 text-yellow-500"/>} />
                            <AttributeMeter label="Passe" value={getAttributeValue(user.attributes?.passing)} icon={<ForwardIcon className="w-5 h-5 text-green-500"/>} />
                        </div>
                    </div>
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
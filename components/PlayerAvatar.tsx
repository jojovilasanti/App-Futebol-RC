
import React from 'react';
import { User } from '../types';

interface PlayerAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ user, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`relative group ${className}`}>
      <img
        src={user.avatarUrl}
        alt={user.nickname}
        className={`${sizeClasses[size]} rounded-full border-2 border-white dark:border-gray-800 shadow-sm object-cover`}
      />
      <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
        {user.name} ({user.nickname}) - {user.position}
        <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve">
          <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
        </svg>
      </div>
    </div>
  );
};

export default PlayerAvatar;

'use client';

import React from 'react';
import { ChannelId } from '@/types';
import { CHANNELS } from '@/data/mockData';
import { 
  Megaphone, 
  BellRing, 
  MessageSquare, 
  Search, 
  Award, 
  Lock, 
  Layers 
} from 'lucide-react';

interface ChannelNavProps {
  activeChannel: ChannelId | 'all';
  onSelectChannel: (channel: ChannelId | 'all') => void;
  isTeacherAuthenticated: boolean;
  onRequestTeacherAuth: () => void;
}

export const ChannelNav: React.FC<ChannelNavProps> = ({
  activeChannel,
  onSelectChannel,
  isTeacherAuthenticated,
  onRequestTeacherAuth,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Megaphone': return <Megaphone className="w-4 h-4" />;
      case 'BellRing': return <BellRing className="w-4 h-4" />;
      case 'MessageSquare': return <MessageSquare className="w-4 h-4" />;
      case 'Search': return <Search className="w-4 h-4" />;
      case 'Award': return <Award className="w-4 h-4" />;
      case 'Lock': return <Lock className="w-4 h-4 text-red-600" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const handleChannelClick = (channelId: ChannelId) => {
    if (channelId === 'teacher-lounge' && !isTeacherAuthenticated) {
      onRequestTeacherAuth();
      return;
    }
    onSelectChannel(channelId);
  };

  return (
    <nav className="mb-8">
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin">
        {/* All feed button */}
        <button
          onClick={() => onSelectChannel('all')}
          className={`neo-btn px-4 py-2.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 font-black shrink-0 ${
            activeChannel === 'all'
              ? 'bg-black text-white dark:bg-white dark:text-black'
              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>전체 피드 보기</span>
        </button>

        {/* Channels */}
        {CHANNELS.map((ch) => {
          const isSelected = activeChannel === ch.id;
          return (
            <button
              key={ch.id}
              onClick={() => handleChannelClick(ch.id)}
              className={`neo-btn px-4 py-2.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 font-black shrink-0 transition-transform ${
                isSelected
                  ? 'scale-105 ring-2 ring-black dark:ring-white ring-offset-2'
                  : 'opacity-90 hover:opacity-100'
              } ${ch.color}`}
            >
              {getIcon(ch.icon)}
              <span>{ch.name}</span>
              {ch.staffOnly && (
                <span className="text-[10px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded border border-black ml-0.5">
                  비공개
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

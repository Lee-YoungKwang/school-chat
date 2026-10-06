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
  isStaffAccessAllowed: boolean;
  onRequestStaffAuth: () => void;
}

export const ChannelNav: React.FC<ChannelNavProps> = ({
  activeChannel,
  onSelectChannel,
  isStaffAccessAllowed,
  onRequestStaffAuth,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Megaphone': return <Megaphone className="w-4 h-4 text-amber-500" />;
      case 'BellRing': return <BellRing className="w-4 h-4 text-sky-500" />;
      case 'MessageSquare': return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      case 'Search': return <Search className="w-4 h-4 text-orange-500" />;
      case 'Award': return <Award className="w-4 h-4 text-purple-500" />;
      case 'Lock': return <Lock className="w-4 h-4 text-rose-500" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const handleChannelClick = (channelId: ChannelId) => {
    if (channelId === 'teacher-lounge' && !isStaffAccessAllowed) {
      onRequestStaffAuth();
      return;
    }
    onSelectChannel(channelId);
  };

  return (
    <nav className="mb-8">
      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin">
        {/* All feed button */}
        <button
          onClick={() => onSelectChannel('all')}
          className={`clay-btn px-4 py-2.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 font-extrabold shrink-0 transition-all ${
            activeChannel === 'all'
              ? 'bg-indigo-600 text-white shadow-md scale-105'
              : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white'
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
              className={`clay-btn px-4 py-2.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 font-bold shrink-0 transition-all ${
                isSelected
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500 shadow-md scale-105 font-extrabold'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              {getIcon(ch.icon)}
              <span>{ch.name}</span>
              {ch.staffOnly && (
                <span className="text-[10px] bg-rose-500 text-white font-extrabold px-1.5 py-0.2 rounded-full ml-0.5 shadow-sm">
                  교직원
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

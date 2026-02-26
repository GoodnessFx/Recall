import React from 'react';
import { Memory } from '../types';
import { motion } from 'framer-motion';
import { ExternalLink, Share2, MoreVertical, MessageSquare, Video, Image as ImageIcon, Link as LinkIcon, Lightbulb } from 'lucide-react';

interface MemoryCardProps {
  memory: Memory;
  onClick: () => void;
  className?: string;
}

export function MemoryCard({ memory, onClick, className = '' }: MemoryCardProps) {
  const getTypeIcon = () => {
    switch (memory.type) {
      case 'tweet': return <MessageSquare className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'bookmark': return <LinkIcon className="w-4 h-4" />;
      case 'idea': return <Lightbulb className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));
  };

  return (
    <motion.div whileHover={{ y: -8 }} onClick={onClick} className={`group relative overflow-hidden bg-card/40 backdrop-blur-xl border border-border/50 rounded-[32px] p-8 hover:border-accent/40 transition-all duration-700 cursor-pointer shadow-xl h-full flex flex-col justify-between ${className}`}>
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"><MoreVertical className="w-5 h-5 text-muted-foreground/40" /></div>
      <div className="space-y-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent group-hover:scale-110 group-hover:bg-accent group-hover:text-background transition-all duration-700">{getTypeIcon()}</div>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent">{memory.source}</span>
              <span className="font-mono text-[7px] text-muted-foreground uppercase tracking-widest">{formatDate(memory.timestamp)}</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-serif tracking-tight leading-[1.2] group-hover:text-accent transition-colors duration-700 italic">{memory.title}</h3>
          <p className="font-mono text-[10px] text-muted-foreground/80 leading-loose line-clamp-3 group-hover:text-foreground transition-colors duration-700">"{memory.content}"</p>
        </div>
      </div>
      <div className="pt-8 space-y-6 relative z-10">
        <div className="h-px w-12 bg-border/20 group-hover:w-full transition-all duration-1000" />
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {memory.tags.slice(0, 2).map(tag => (
              <span key={tag} className="font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground/60 group-hover:border-accent/20 group-hover:text-accent transition-colors">#{tag}</span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-muted-foreground/40">
            <Share2 className="w-3.5 h-3.5 hover:text-accent transition-colors" /><ExternalLink className="w-3.5 h-3.5 hover:text-accent transition-colors" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

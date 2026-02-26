import React from 'react';
import { Button } from './ui/button';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed?: boolean;
  className?: string;
}

interface SidebarItem {
  id: string;
  label: string;
  shortLabel: string;
  badge?: string | number;
  isPremium?: boolean;
}

const mainItems: SidebarItem[] = [
  { id: 'home', label: 'Timeline', shortLabel: 'TM' },
  { id: 'search', label: 'Search', shortLabel: 'SH' },
  { id: 'ai', label: 'AI Assistant', shortLabel: 'AI', badge: 'Beta' },
  { id: 'insights', label: 'Insights', shortLabel: 'IN', isPremium: true },
];

const libraryItems: SidebarItem[] = [
  { id: 'recent', label: 'Recent', shortLabel: 'RC', badge: 12 },
  { id: 'favorites', label: 'Favorites', shortLabel: 'FV', badge: 5 },
  { id: 'archived', label: 'Archived', shortLabel: 'AR' },
  { id: 'tags', label: 'Tags', shortLabel: 'TG' },
];

const settingsItems: SidebarItem[] = [
  { id: 'connectors', label: 'Connectors', shortLabel: 'CN', badge: '3/10' },
  { id: 'analytics', label: 'Analytics', shortLabel: 'AN', isPremium: true },
  { id: 'settings', label: 'Settings', shortLabel: 'ST' },
  { id: 'help', label: 'Help', shortLabel: 'HP' },
];

export function Sidebar({ activeTab, onTabChange, isCollapsed = false, className = '' }: SidebarProps) {
  const renderItem = (item: SidebarItem) => (
    <Button key={item.id} variant={activeTab === item.id ? "secondary" : "ghost"} size="sm" onClick={() => onTabChange(item.id)} className={`w-full justify-start gap-4 py-6 ${isCollapsed ? 'px-2' : 'px-4'} ${activeTab === item.id ? 'bg-accent/10 text-accent border border-accent/20' : 'text-muted-foreground hover:text-foreground'}`} title={isCollapsed ? item.label : undefined}>
      <span className="font-mono text-[10px] font-bold shrink-0 w-6 h-6 flex items-center justify-center border border-current/20 rounded-md">{item.shortLabel}</span>
      {!isCollapsed && (
        <>
          <span className="flex-1 text-left font-mono text-[10px] uppercase tracking-widest">{item.label}</span>
          <div className="flex items-center gap-2">
            {item.isPremium && <span className="text-[8px] font-mono text-accent">PRO</span>}
            {item.badge && <span className="text-[8px] font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">{item.badge}</span>}
          </div>
        </>
      )}
    </Button>
  );

  return (
    <aside className={`flex flex-col h-full bg-card/30 backdrop-blur-xl border-r border-border ${className}`}>
      <div className="flex-1 overflow-y-auto p-6 space-y-12">
        {!isCollapsed && (
          <div className="px-4 py-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(245,166,35,0.2)]">
                <span className="font-mono text-lg font-bold text-background">R</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] font-bold tracking-tighter">RECALL</span>
                <span className="font-mono text-[7px] text-muted-foreground uppercase tracking-widest">Neural Vault</span>
              </div>
            </div>
          </div>
        )}
        <div className="space-y-4">
          {!isCollapsed && <h3 className="font-mono text-[8px] uppercase tracking-[0.4em] text-muted-foreground/40 px-4">Registry</h3>}
          <div className="space-y-2">{mainItems.map(renderItem)}</div>
        </div>
        <div className="space-y-4">
          {!isCollapsed && <h3 className="font-mono text-[8px] uppercase tracking-[0.4em] text-muted-foreground/40 px-4">Archives</h3>}
          <div className="space-y-2">{libraryItems.map(renderItem)}</div>
        </div>
        <div className="space-y-4">
          {!isCollapsed && <h3 className="font-mono text-[8px] uppercase tracking-[0.4em] text-muted-foreground/40 px-4">Systems</h3>}
          <div className="space-y-2">{settingsItems.map(renderItem)}</div>
        </div>
      </div>
      {!isCollapsed && (
        <div className="p-6 border-t border-border/50">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
              <span className="font-mono text-[10px] text-accent">A</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-mono text-[9px] font-bold truncate">Archivist</span>
              <span className="font-mono text-[7px] text-muted-foreground truncate uppercase tracking-widest">Tier 1 Elite</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

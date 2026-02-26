import React from 'react';
import { motion } from 'framer-motion';
import { X, User, Settings, Database, Zap, LogOut, ChevronRight, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface SettingsPanelProps { onFinish?: () => void; onClose: () => void; }

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { user, signOut } = useAuth();
  const handleSignOut = async () => { try { await signOut(); toast.success('Vault de-synchronized. See you in the next cycle.'); onClose(); } catch (err) { toast.error('Failed to de-synchronize.'); } };
  const sections = [
    { id: 'profile', label: 'Identity & Access', icon: User, items: [ { label: 'Profile Settings', value: 'Archivist Level 1', action: 'Update' }, { label: 'Neural Key', value: '••••••••••••••••', action: 'Change' }, { label: 'Tier Status', value: 'Elite Explorer', action: 'Upgrade', special: true } ] },
    { id: 'systems', label: 'Vault Systems', icon: Database, items: [ { label: 'Storage Usage', value: '12.4 GB / 100 GB', action: 'Optimize' }, { label: 'Backup Frequency', value: 'Real-time Sync', action: 'Configure' }, { label: 'Privacy Protocols', value: 'Level 4 AES', action: 'Review' } ] },
    { id: 'interface', label: 'Neural Interface', icon: Zap, items: [ { label: 'Display Theme', value: 'Brutalist Dark', action: 'Toggle' }, { label: 'Haptic Feedback', value: 'Subtle Pulse', action: 'Adjust' }, { label: 'Notification Stream', value: 'Filtered', action: 'Manage' } ] }
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <header className="flex items-end justify-between border-b border-border/10 pb-16">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center text-accent shadow-[0_0_40px_rgba(245,166,35,0.1)]"><Settings className="w-7 h-7" /></div>
            <div className="flex flex-col"><span className="font-mono text-[9px] uppercase tracking-[0.4em] text-accent">System Registry</span><span className="font-mono text-[7px] uppercase tracking-[0.2em] text-muted-foreground/40">v2.4 — CONFIG CORE</span></div>
          </div>
          <h1 className="text-7xl md:text-9xl font-serif leading-[0.9] tracking-tighter max-w-4xl italic">Configure your <br/><span className="text-foreground italic">Experience.</span></h1>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-14 w-14 hover:bg-white/5 border border-border/20"><X className="w-6 h-6" /></Button>
      </header>
      <div className="space-y-12 pb-32">
        {sections.map((section, i) => (
          <motion.section key={section.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card/20 backdrop-blur-md border border-border/40 rounded-[48px] p-12 md:p-16 space-y-12">
            <div className="flex items-center gap-6"><div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground/60"><section.icon className="w-5 h-5" /></div><h3 className="text-4xl font-serif tracking-tight italic">{section.label}</h3></div>
            <div className="space-y-6">{section.items.map((item, j) => (<div key={item.label} className="group flex items-center justify-between p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-accent/40 transition-all duration-700 cursor-pointer"><div className="space-y-2"><span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/40">{item.label}</span><div className="flex items-center gap-4"><span className={`font-mono text-xs ${item.special ? 'text-accent font-bold' : 'text-foreground/80'}`}>{item.value}</span>{item.special && <Crown className="w-3.5 h-3.5 text-accent" />}</div></div><Button variant="ghost" className="font-mono text-[9px] uppercase tracking-widest text-accent/60 group-hover:text-accent transition-colors flex items-center gap-3">{item.action}<ChevronRight className="w-4 h-4" /></Button></div>))}</div>
          </motion.section>
        ))}
        <div className="pt-12 border-t border-border/10 flex items-center justify-between"><div className="space-y-2"><span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">Persistence Layer</span><p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground/20 italic">End current neural synchronization session.</p></div><Button onClick={handleSignOut} className="px-12 py-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full font-mono text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-background transition-all shadow-xl"><LogOut className="w-4 h-4 mr-4" />De-Synchronize Vault</Button></div>
      </div>
    </div>
  );
}

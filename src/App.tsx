import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import { LoginForm } from './components/LoginForm';
import { useMemories } from './hooks/useMemories';
import { Memory } from './types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import { Onboarding } from './components/Onboarding';
import { ShelfView } from './components/ShelfView';
import { CardDetail } from './components/CardDetail';
import { SparkMoment } from './components/SparkMoment';
import { Sidebar } from './components/Sidebar';
import { SettingsPanel } from './components/SettingsPanel';
import { AIChat } from './components/AIChat';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { Timeline } from './components/Timeline';
import { AddMemoryDialog } from './components/AddMemoryDialog';
import { Plus } from 'lucide-react';

function AppContent() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedShelf, setSelectedShelf] = useState<string | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [sparkMemory, setSparkMemory] = useState<Memory | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'team'>('personal');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  
  const { user, loading: authLoading } = useAuth();
  const { memories, loading: memoriesLoading } = useMemories();

  useEffect(() => {
    if (user && !authLoading) {
      toast.success(`Vault established: ${user.name}`, {
        className: 'font-mono uppercase tracking-widest text-[10px] bg-card border-border text-accent',
      });
      
      if (memories.length > 0) {
        const timer = setTimeout(() => {
          const randomMemory = memories[Math.floor(Math.random() * memories.length)];
          setSparkMemory(randomMemory);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [user, memories, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-accent animate-pulse">
          Synchronizing Neural Interface...
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const handleShelfClick = (shelf: string) => {
    setSelectedShelf(shelf);
  };

  const handleMemoryClick = (memory: Memory) => {
    setSelectedMemory(memory);
  };

  const shelves = [
    { name: 'Design Inspo', count: 428, label: 'IG', color: 'text-pink-400' },
    { name: 'Dev Resources', count: 856, label: 'TW', color: 'text-blue-400' },
    { name: 'Quotes', count: 124, label: 'QT', color: 'text-accent' },
    { name: 'Business/Startup', count: 312, label: 'YT', color: 'text-red-400' },
    { name: 'Humor', count: 567, label: 'TK', color: 'text-secondary' },
    { name: 'The Graveyard', count: 89, label: 'GY', color: 'text-zinc-600', special: true },
    { name: 'Time Capsule', count: 12, label: 'TC', color: 'text-secondary', special: true },
  ];

  const [searchQuery, setSearchQuery] = useState('');

  const filteredMemories = memories.filter(m => 
    m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-background text-foreground selection:bg-accent/30 selection:text-accent font-sans relative overflow-hidden">
      {/* Global Noise Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] z-[100]" />

      <Sidebar 
        activeTab={currentView} 
        onTabChange={(tab) => {
          setCurrentView(tab);
          setSelectedShelf(null);
        }}
        isCollapsed={isSidebarCollapsed}
        className="w-80 shrink-0"
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12 pt-24 pb-48">
          <AnimatePresence mode="wait">
            {currentView === 'home' && (
              <motion.div 
                key="home-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {selectedShelf ? (
                  <ShelfView 
                    shelfName={selectedShelf}
                    memories={filteredMemories.filter(m => {
                      if (selectedShelf === 'The Graveyard') {
                        const oneYearAgo = new Date();
                        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                        return new Date(m.timestamp) < oneYearAgo;
                      }
                      if (selectedShelf === 'Time Capsule') {
                        return m.tags.includes('capsule');
                      }
                      return m.tags.includes(selectedShelf.toLowerCase().split(' ')[0]) || 
                             m.source.toLowerCase() === selectedShelf.toLowerCase();
                    })}
                    onBack={() => setSelectedShelf(null)}
                    onMemoryClick={handleMemoryClick}
                  />
                ) : (
                  <Timeline 
                    memories={filteredMemories}
                    onMemoryClick={handleMemoryClick}
                    user={user}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    shelves={shelves}
                    handleShelfClick={handleShelfClick}
                  />
                )}
              </motion.div>
            )}

            {currentView === 'ai' && <AIChat />}
            {currentView === 'analytics' && <AnalyticsPanel />}
            {currentView === 'settings' && <SettingsPanel onClose={() => setCurrentView('home')} />}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Search Bar */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[900px] px-8 z-[150] flex items-center gap-6">
        <div className="relative group flex-1">
          <div className="absolute inset-0 bg-accent/20 blur-[120px] rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
          <div className="relative flex items-center bg-card/60 backdrop-blur-3xl border border-border/50 rounded-full px-10 py-8 shadow-[0_40px_80px_rgba(0,0,0,0.6)] focus-within:border-accent/40 transition-all duration-1000">
            <div className="font-mono text-[10px] text-accent mr-10 group-focus-within:scale-110 transition-transform uppercase tracking-[0.4em]">Search</div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="fragment, mood, or resonance..." 
              className="bg-transparent border-none outline-none w-full font-mono text-xl md:text-2xl placeholder:text-muted-foreground/20 text-accent/90 ring-0 focus:ring-0"
            />
            <div className="flex items-center gap-4 ml-10 border-l border-border/20 pl-10 opacity-40 group-focus-within:opacity-100 transition-opacity">
              <kbd className="font-mono text-[10px] bg-white/5 px-3 py-1.5 rounded-lg text-muted-foreground/60">⌘</kbd>
              <kbd className="font-mono text-[10px] bg-white/5 px-3 py-1.5 rounded-lg text-muted-foreground/60">K</kbd>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsAddMemoryOpen(true)}
          className="w-24 h-24 bg-accent text-background rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(245,166,35,0.3)] hover:scale-110 active:scale-95 transition-all duration-500 group"
          title="Add New Fragment"
        >
          <Plus className="w-10 h-10 group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {isAddMemoryOpen && (
          <AddMemoryDialog 
            isOpen={isAddMemoryOpen} 
            onClose={() => setIsAddMemoryOpen(false)} 
          />
        )}
        {selectedMemory && (
          <CardDetail 
            memory={selectedMemory} 
            onClose={() => setSelectedMemory(null)} 
          />
        )}

        {sparkMemory && (
          <SparkMoment 
            memory={sparkMemory}
            onClose={() => setSparkMemory(null)}
            onViewDetail={() => {
              setSelectedMemory(sparkMemory);
              setSparkMemory(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SupabaseProvider>
          <AppContent />
        </SupabaseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

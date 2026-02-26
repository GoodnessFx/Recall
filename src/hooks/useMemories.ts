import { useState, useEffect } from 'react';
import { Memory, MemoryType } from '../types';
import { useSupabase } from '../contexts/SupabaseContext';
import { useAuth } from '../contexts/AuthContext';

const generateMockMemories = (): Memory[] => {
  const types: MemoryType[] = ['tweet', 'video', 'image', 'bookmark', 'idea'];
  const sources = ['X', 'YouTube', 'Instagram', 'TikTok', 'Facebook', 'Reddit'];
  const contents = [
    'The best way to predict the future is to create it. Thinking about minimalist architecture and how it applies to digital interfaces.',
    'Just saw a incredible video on systems thinking and brutalist UI patterns. Hits different when you look at the arc of design evolution.',
    'Minimalist architecture is not just about less, it is about the right amount. Stoic philosophy meets modern build patterns.',
    'A thread on why most creative tools fail because they ignore the memory layer of the internet.',
    'This specific quote Resonance: "Simplicity is the ultimate sophistication." - Da Vinci',
    'Researching the intersection of neural networks and personal memory management.',
    'The architecture of the soul is built from the fragments of the internet we choose to save.',
    'Systems design is the art of making the invisible visible.',
    'Archiving is an act of love for the future self.',
  ];

  const memories: Memory[] = [];
  
  for (let i = 0; i < 50; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const content = contents[Math.floor(Math.random() * contents.length)];
    
    const timestamp = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const tags = ['design', 'development', 'quotes', 'business', 'inspiration'].slice(0, Math.floor(Math.random() * 3) + 1);
    
    memories.push({
      id: `memory-${i}`,
      type,
      title: `Memory Fragment #${i + 1}`,
      content,
      source,
      timestamp,
      tags,
      metadata: {
        url: 'https://example.com',
        mood: ['INSIGHT', 'FIRE', 'CHAOS', 'TOUCHED', 'HUMOR'][Math.floor(Math.random() * 5)],
      },
      summary: `AI Archival Insight: This ${source} post from your ${type} collection explores the intersection of creativity and digital systems.`
    });
  }

  return memories.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export function useMemories() {
  const { connected } = useSupabase();
  const { user } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMemories = async () => {
      setLoading(true);
      // Fallback to mock data for now
      const mockMemories = generateMockMemories();
      setMemories(mockMemories);
      setLoading(false);
    };

    loadMemories();
  }, [connected, user]);

  return { memories, loading };
}

"use client";
import { useEffect, useRef, useState } from "react";

type SR = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: (e: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: () => void;
};

export default function VoiceInput() {
  const recRef = useRef<SR | null>(null);
  const [listening, setListening] = useState(false);
  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
    const Rec = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Rec) return;
    if (recRef.current == null) {
      const rec: SR = new Rec();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (e: SpeechRecognitionEvent) => {
        const transcript = (e.results?.[0]?.[0]?.transcript as string) ?? "";
        if (transcript) {
          window.location.href = `/search?q=${encodeURIComponent(transcript)}`;
        }
        setListening(false);
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);
      recRef.current = rec;
    }
  }, []);
  return (
    <button
      aria-label="Voice search"
      onClick={() => {
        if (!recRef.current) return;
        if (!listening) {
          recRef.current?.start();
          setListening(true);
        } else {
          recRef.current?.stop();
        }
      }}
      className="fixed bottom-6 right-6 z-50 rounded-full bg-white/10 hover:bg-white/20 text-white px-4 py-2"
    >
      {listening ? "Listening…" : "Voice Search"}
    </button>
  );
}

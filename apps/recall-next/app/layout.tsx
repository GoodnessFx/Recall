import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import SWRegister from "@/components/sw-register";
import CommandBar from "@/components/command-bar";
import VoiceInput from "@/components/voice-input";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recall — Your Unified Second Brain",
  description: "Save, auto-tag, and recall everything. Powered by Supabase + AI.",
  manifest: "/manifest.json",
  applicationName: "Recall",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <SWRegister />
          {children}
          <CommandBar />
          <VoiceInput />
        </Providers>
      </body>
    </html>
  );
}

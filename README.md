# Recall — Your second Brain

Recall is a premium, scalable web app that pulls saved/bookmarked content from multiple sources, auto-tags by context, embeds for semantic recall, and delivers reminders, digests, and notifications. Built for mobile and desktop with a focus on X, Instagram, and TikTok saves.

## Architecture

- **Next.js 16 (App Router)**: Fast, server-rendered frontend with fluid Page Transitions.
- **Supabase**: PostgreSQL database with `pgvector`, Auth, and strict Row-Level Security (RLS).
- **Gemini 1.5 Flash**: AI-powered categorization, summarization, conversational search assistant, and video content ideas.
- **PWA**: Installable on mobile with full Share Target support for saving directly from social apps.
- **Design**: Premium "Obsidian" dark-first aesthetic with minimal branding and custom spring motion.

## Features

- **Conversational Recall AI**: Talk to your second brain. Find videos or bookmarks you've forgotten, and get creative video ideas based on your saves.
- **Mobile Share Target**: Save TikToks, Reels, and X posts directly from your phone's share sheet to Recall.
- **AI Categorization & Video Ideas**: Automatic tagging (Education, Inspiration, etc.) and AI-generated video ideas for creators.
- **Brutalist Splash Screen**: Clean, minimalist entry with "Your second brain" philosophy.
- **Bulk Importers**: Specialized handlers for TikTok `user_data_tiktok`, Instagram JSON, X, and Reddit exports.

## Project Structure

- `apps/recall-next/`: Core Next.js 16 application.
- `apps/recall-next/data/`: Data export storage for bulk imports (TikTok/Instagram).
- `extension/`: Chrome extension for desktop saving.

## Setup & Development

### 1) Environment Variables
Copy `.env.example` to `apps/recall-next/.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_APP_URL` (e.g., http://localhost:3000)

### 2) Database Setup
Apply SQL migrations in `apps/recall-next/supabase/migrations/` to set up `pgvector` and RLS.

### 3) Running the App
```bash
npm install
npm run dev
```

## Deployment

- **Vercel**: Set root to `apps/recall-next`.
- **Supabase**: Enable Google/X OAuth with correct redirect URI `${NEXT_PUBLIC_APP_URL}/auth/callback`.

## Security

- **Strict RLS**: Every query is gated by `auth.uid()`.
- **Rate Limiting**: Integrated protection for AI and Import routes.
- **Privacy First**: Your data remains yours, protected by Supabase.

---
*RECALL — Everything you saved. Finally found.*

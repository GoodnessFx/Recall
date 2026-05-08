# Recall — Your Second Brain

Recall is a premium, scalable web app that pulls saved/bookmarked content from multiple sources, auto-tags by context, embeds for semantic recall, and delivers reminders, digests, and notifications. Built for mobile and desktop with strict security and zero tolerance for mistakes.

## Architecture

- **Next.js 14 (App Router)**: Fast, server-rendered frontend with fluid Page Transitions.
- **Supabase**: PostgreSQL database, Auth, and strict Row-Level Security (RLS).
- **Gemini 1.5 Flash**: AI-powered categorization, summarization, and a conversational search assistant.
- **PWA**: Installable on mobile with full Share Target support.
- **Design**: Premium "Obsidian" dark-first aesthetic with custom spring motion.

## Features

- **Conversational Recall AI**: Talk to your second brain. Find bookmarks based on mood, topic, or context.
- **Share Sheet Method**: Save bookmarks from any app (Instagram, TikTok, X, etc.) via the PWA share menu.
- **AI Categorization**: Automatic tagging into Education, Inspiration, Reference, Fun, or Archive.
- **Staggered Grid**: Polished, staggered entrance animations for your saved content.
- **Bulk Import**: Integrated importers for X (Twitter), Reddit, and Instagram JSON exports.

## Project Structure

- `apps/recall-next/`: The core Next.js application.
- `apps/recall-next/data/instagram/`: Location for your Instagram export files.
- `extension/`: Chrome extension for one-click desktop saving.

## Setup & Development

### 1) Environment Variables
Copy `.env.example` to `apps/recall-next/.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_APP_URL` (e.g., http://localhost:3000)

### 2) Database Setup
Run the SQL migration found in `apps/recall-next/supabase/migrations/20260508_bookmarks.sql` in your Supabase SQL Editor to set up the schema and RLS policies.

### 3) Running the App
You can run the app directly from the root:
```bash
npm install
npm run dev
```

## Deployment

1. Connect your repository to **Vercel**.
2. Set the root directory to `apps/recall-next`.
3. Add your environment variables in the Vercel dashboard.
4. Ensure Google OAuth is enabled in Supabase with the correct callback URL.

## Security

- **Strict RLS**: Every query is gated by `auth.uid()`.
- **Sanitization**: All metadata is sanitized via `isomorphic-dompurify`.
- **Rate Limiting**: Integrated protection for your Gemini API quota.

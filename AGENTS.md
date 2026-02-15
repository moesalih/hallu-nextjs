# AGENTS.md

## Project Overview

hallu

ai generated social network prototype

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 
- **Styling**: Tailwind CSS v4 + @pigment-css/react
- **Icons**: Lucide React
- **API**: tRPC
- **DB**: Cloudflare D1
- **File Storage**: Cloudflare R2

## Commands

**Package manager: pnpm** (preferred over npm)

- `pnpm dev` - Dev server
- `pnpm build` - Production build

- `npx wrangler d1 execute hallu --remote --command "SELECT ..."` for interacting with D1 database (migrations, queries, etc.)

## Project Structure

- `/app` - Next.js (App Router)
  - `api/trpc/[trpc]/route.ts` - tRPC handlers
- `/lib/components` - React components
- `/lib/services` - API layer
  - `cloudflare-d1.ts` - Cloudflare D1 client (backend)
  - `cloudflare-r2.ts` - Cloudflare R2 client (backend)
  - `db.ts` - Database queries (backend)
  - `trpc.ts` - tRPC client (frontend)
- `/lib/providers` - React contexts
  - `auth-provider.tsx` - Auth (uses @neynar/react only for auth button/context)
- `/lib/utils` - Utilities

## Key Conventions

- TypeScript for all code
- Clean, minimal, organized code. each component/func should have a single responsibility.
- Server components by default, `'use client'` for interactivity
- Use `fetchDirectOrProxyJSON()` utility for API calls

## Environment Variables

Check `.env.development` for required vars


# BibleGPT — Next.js + TypeScript

A Bible AI chatbot converted from a plain HTML/JS frontend to a full **Next.js 14 TypeScript** app that deploys cleanly on Vercel.

## Why this conversion keeps your API key safe

| Old approach | New approach |
|---|---|
| `server.js` with secret embedded in plain JS | `pages/api/ask.ts` — compiled server-side, never shipped to browser |
| Open source exposes `server.js` to everyone | Next.js API routes are server-only, invisible to clients |
| `BIBLE_API_KEY` visible in source | Read from `process.env` — set only in Vercel's dashboard |

## Project structure

```
biblegpt/
├── lib/
│   ├── rateLimit.ts     # Rate-limiter (server-side only)
│   └── types.ts         # Shared TypeScript types
├── pages/
│   ├── api/
│   │   └── ask.ts       # 🔒 Secure API proxy — API key lives here
│   ├── _app.tsx
│   ├── _document.tsx
│   └── index.tsx        # Main chat UI
├── .env.example         # Template — copy to .env.local for local dev
├── .gitignore           # .env.local is excluded
├── next.config.js
├── package.json
├── tsconfig.json
└── vercel.json
```

## Local development

```bash
npm install

# Create .env.local (never commit this file!)
cp .env.example .env.local
# Edit .env.local and add your real values

npm run dev
# → http://localhost:3000
```

## Deploy to Vercel

1. Push this repo to GitHub (the `.gitignore` excludes `.env.local`).
2. Import the repo in [vercel.com](https://vercel.com).
3. In **Project Settings → Environment Variables**, add:
   - `BIBLE_API_KEY` = `selovasx2024` (or your key)
   - `BIBLE_API_URL` = `https://pasayloakomego.onrender.com/api/bibleai`
4. Click **Deploy** — done.

> Your API key is **never** in the source code. It only lives in Vercel's encrypted environment variable store.

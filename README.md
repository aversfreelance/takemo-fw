# Takemo — takemo.co.uk

Multi-page Vite + React site for Take Me Online. Logos live in `public/logos` (copied from the Takemo brand folder).

## Pages

- `/` Home
- `/what-we-do` and `/what-we-do/:slug`
- `/web-design` `/management` `/maintenance`
- `/book` `/quote` `/contact` `/insights` `/privacy`

## Run

```bash
npm install
npm run dev
```

Locally the API can keep users, orders and the live catalog in `server/data`. On Vercel set `DATABASE_URL` to a Neon Postgres connection string so that data persists.

Also set `PUBLIC_URL` to the live site URL, plus Stripe / Google keys if you use them. Superuser: `avers.freelance@gmail.com`.

# Content Management System

A production-ready, decoupled Content Management System with two consuming frontends:
an authenticated **Admin Panel** for managing content, and a **Public Website** that
renders content dynamically via API — no hardcoded data.

## Live Deployment

| App | URL |
|---|---|
| Public Website | [https://content-management-system-pvc8.vercel.app/](https://content-management-system-pvc8.vercel.app/) |
| Admin Panel | [https://content-management-system-pvc8.vercel.app/](https://content-management-system-pvc8.vercel.app/) |
| Backend API | https://content-management-system-seven-ruby.vercel.app/ |

## Demo Credentials

```
Email:    admin@renewcred.com
Password: admin123
```


## Tech Stack

| Layer | Technology |
|---|---|
| Database | PostgreSQL (Supabase, managed) |
| ORM | Prisma |
| Backend | Express.js, JWT auth, bcryptjs, Zod validation |
| Admin Frontend | React.js (Vite), Redux Toolkit, React Router, Tailwind CSS v4, TipTap |
| Public Frontend | Next.js (App Router), Tailwind CSS v4, react-katex |
| Deployment | Vercel (all three apps, separate projects) |

## Architecture Overview

This is a decoupled, headless CMS with three independent applications sharing one database:

```text
renewcred-cms/
├── backend/          Express API — auth + content CRUD
├── admin-frontend/   React (Vite) — authenticated content management
└── public-frontend/  Next.js — public-facing site, consumes the API
```


**Why this split:** the admin panel is behind auth and has no SEO requirements, so a
lightweight React SPA (Vite) is sufficient. The public site benefits from Next.js's
server-side rendering for both SEO and faster first paint on content pages.

### Content Model — Block-Based Schema

Website content isn't uniform — some is a short header, some is a full data table or a
LaTeX equation. Rather than a flat schema (`title`, `description`, ...) that can't scale
to this variety, each `Page` holds an ordered array of `Block`s:

```
Page  { id, title, slug, blocks[] }
Block { id, type, data (JSON), order, pageId }
```


`type` is one of `header | paragraph | list | table | equation`, and `data` is a
JSON payload whose shape depends on `type`. This lets new block types be added later
without a schema migration for every content variation — a new block type just needs a
new `type` value, a new editor component (admin), and a new render case
(`BlockRenderer`, public).

### Authentication

JWT-based, stateless. No public "Register" endpoint by design — admin accounts are
provisioned via a seed script (`backend/prisma/seed.js`), not self-serve signup, since
admin access should be limited to trusted operators, not open to anyone who finds the
API. Logout is handled client-side by discarding the token; there is no server-side
token blacklist (acceptable tradeoff for this scope; a production system might add
token revocation via a short-lived-token + refresh-token pattern).

### State Management (Redux Toolkit vs local state)

Redux Toolkit is used only for state that needs to persist and be shared across route
changes:
- `authSlice` — token, admin identity, authentication status
- `pagesSlice` — the list of pages shown on the dashboard

Everything else — form inputs in the login form, the in-progress block array while
editing a page, per-block editor state — stays in local component state (`useState`).
This content is transient and scoped to a single page/component; putting it in Redux
would add indirection without benefit.

### Public Content Fetching

The public frontend fetches with `cache: 'no-store'` on every request, so content
edits made in the admin panel are reflected immediately without a rebuild/redeploy.
A production system at higher traffic might instead use Incremental Static
Regeneration (ISR) with on-demand revalidation triggered from the CMS's save action,
trading a small content-staleness window for significantly better performance.

## Setup Instructions

### Prerequisites
- Node.js v18 or v20
- A Supabase project (or any PostgreSQL instance)

### 1. Clone and install
```bash
git clone https://github.com/YOUR_USERNAME/renewcred-cms.git
cd renewcred-cms

cd backend && npm install
cd ../admin-frontend && npm install
cd ../public-frontend && npm install
```

### 2. Environment variables

**`backend/.env`** (see `backend/.env.example`)

```env
DATABASE_URL="your-supabase-pooler-connection-string"
DIRECT_URL="your-supabase-direct-connection-string"
JWT_SECRET="a-long-random-string"
PORT=5000
```


**`admin-frontend/.env`**

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_PUBLIC_URL=http://localhost:3000
```


**`public-frontend/.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```


### 3. Database setup
```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```
This creates the `Admin`, `Page`, and `Block` tables and seeds one admin user
(`admin@renewcred.com` / `admin123`).

### 4. Run all three apps (separate terminals)
```bash
# Terminal 1
cd backend && npm run dev        # http://localhost:5000

# Terminal 2
cd admin-frontend && npm run dev # http://localhost:5173

# Terminal 3
cd public-frontend && npm run dev # http://localhost:3000
```

### 5. Using the CMS
1. Open the admin panel, log in with the seeded credentials
2. Click **+ Create New Page**, give it a title and slug (use slug `home` to have it
   render at the public site's root `/`)
3. Add blocks (header, paragraph, list, table, equation) and Save
4. View the live page on the public frontend at `/{slug}`, or click the page title
   from the dashboard to open it directly

## Assumptions

- **No public registration** — admin accounts are seeded directly into the database,
  not created via an open API endpoint, as a deliberate security decision.
- **`slug: "home"` is a special-cased root page** — the public frontend's `/` route
  looks specifically for a page with slug `home`; any other slug is only reachable at
  `/{slug}`.
- **`updatePage` replaces all blocks** rather than diffing individual block changes —
  simpler and safe for this scope; a system with concurrent multi-editor support would
  need a diffing/locking strategy instead.
- **List blocks currently support flat lists in the admin editor**, though the schema
  and public renderer already support nested lists (`items: [{ text, children: [] }]`).
  Extending the editor UI to author nested items is a straightforward addition, kept
  out of scope here to avoid over-building past what the assignment needed.
- **Paragraph content is rendered via `dangerouslySetInnerHTML`** from TipTap's HTML
  output. This is acceptable because content is authored by trusted, authenticated
  admins only, not arbitrary end users — the CMS is not open to public content
  submission.
- **CORS is restricted** to known frontend origins (localhost during dev, the deployed
  Vercel URLs in production) rather than left open to all origins.

## Deployment Notes

Each app is deployed as a separate Vercel project, with **Root Directory** set to
`backend`, `admin-frontend`, and `public-frontend` respectively within the same
GitHub repo. The backend runs as a Vercel serverless function via `vercel.json`;
`app.listen()` only runs when `NODE_ENV !== 'production'`, so local dev and serverless
production share the same Express app instance.
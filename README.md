# EventX

> The unified command center for school events. From debates to cultural fests — schedules, registrations, announcements, and live updates under one roof.

Built with **Next.js 16**, **Express 5**, **Prisma**, **SQLite**, and **framer-motion**.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │ Landing  │  │  Events  │  │Registra- │  │ Announcements  │  │
│  │  Page    │  │  Browse  │  │  tions   │  │                │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────────┘  │
│                        │                        │               │
│                        ▼                        ▼               │
│              ┌─────────────────────────────────────┐            │
│              │       Next.js App Router            │            │
│              │  ┌──────────┐  ┌──────────────────┐ │            │
│              │  │ Auth     │  │  API Client      │ │            │
│              │  │ (JWT)    │  │  (fetch wrapper) │ │            │
│              │  └──────────┘  └────────┬─────────┘ │            │
│              └─────────────────────────┼───────────┘            │
└────────────────────────────────────────┼────────────────────────┘
                                         │ HTTP (JSON)
                                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS API SERVER (Port 5000)               │
│                                                                 │
│  ┌─────────┐  ┌─────────┐  ┌────────────┐  ┌──────────────┐   │
│  │  Auth   │  │ Events  │  │Registrations│  │Announcements │   │
│  │ Routes  │  │ Routes  │  │   Routes    │  │   Routes     │   │
│  └────┬────┘  └────┬────┘  └──────┬──────┘  └──────┬───────┘   │
│       │            │              │                │           │
│       ▼            ▼              ▼                ▼           │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Middleware Pipeline                        │    │
│  │  ┌──────────┐  ┌───────────┐  ┌──────────────────┐    │    │
│  │  │   CORS   │  │   JSON    │  │  JWT Auth Guard  │    │    │
│  │  └──────────┘  └───────────┘  └──────────────────┘    │    │
│  └──────────────────────┬─────────────────────────────────┘    │
│                         │                                      │
│                         ▼                                      │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    Prisma ORM                          │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │              SQLite Database                      │  │    │
│  │  │  ┌──────┐  ┌──────┐  ┌──────────┐  ┌──────────┐ │  │    │
│  │  │  │ User │  │Event │  │Registra- │  │Announce- │ │  │    │
│  │  │  │      │  │      │  │  tion    │  │  ment    │ │  │    │
│  │  │  └──────┘  └──────┘  └──────────┘  └──────────┘ │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow — Registration

```
User clicks "Register" ──► POST /api/registrations (with JWT)
        │
        ▼
  Express auth middleware ──► JWT verified ──► userId extracted
        │
        ▼
  Prisma checks: event exists? already registered?
        │
        ▼
  crypto.randomUUID() generates unique QR code
        │
        ▼
  Registration saved ──► Response with QR code
        │
        ▼
  Frontend renders QR via api.qrserver.com
        │
        ▼
  User shows QR at venue ──► Admin scans/checks in
```

### Data Flow — Auth

```
Register ──► POST /api/auth/register
  ├── bcrypt.hash(password, 12)
  ├── Prisma creates user
  └── jwt.sign({ userId, role }) ──► token stored in localStorage

Login ──► POST /api/auth/login
  ├── bcrypt.compare(password, hash)
  └── jwt.sign({ userId, role }) ──► token stored in localStorage

/me ──► GET /api/auth/me (Bearer token)
  ├── jwt.verify(token) ──► userId
  └── Prisma user lookup
```

---

## Tech Stack

| Layer     | Tech                                              |
| --------- | ------------------------------------------------- |
| Frontend  | Next.js 16, React 19, TypeScript 6                |
| Animations| framer-motion 12                                  |
| Styling   | Inline styles + `<style>` blocks, CSS custom props|
| Backend   | Express 5, TypeScript 6                           |
| Database  | SQLite via Prisma ORM                             |
| Auth      | bcryptjs + jsonwebtoken                           |
| QR Codes  | api.qrserver.com (no library)                     |
| Font      | Outfit (Google Fonts)                             |

---

## Database Schema

```
┌──────────────────────────────┐
│            User              │
├──────────────────────────────┤
│  id          String (cuid)   │
│  name        String          │
│  email       String (unique) │
│  password    String (bcrypt) │
│  role        String          │
│  avatar      String?         │
│  createdAt   DateTime        │
│  updatedAt   DateTime        │
├──────────────────────────────┤
│  registrations Registration[]│
└──────────────┬───────────────┘
               │ 1
               │
               │ *
               ▼
┌──────────────────────────────┐
│        Registration          │
├──────────────────────────────┤
│  id           String (cuid)  │
│  eventId      String         │──┐
│  userId       String         │  │
│  ticketType   String         │  │
│  qrCode       String (uuid)  │  │
│  registeredAt DateTime       │  │
│  checkedIn    Boolean        │  │
│  checkedInAt  DateTime?      │  │
├──────────────────────────────┤  │
│  event  Event  (FK)          │◄─┤
│  user   User   (FK)          │◄─┘
└──────────────────────────────┘

┌──────────────────────────────┐
│           Event              │
├──────────────────────────────┤
│  id          String (cuid)   │
│  title       String          │
│  description String          │
│  type        String          │
│  venue       String          │
│  startDate   DateTime        │
│  endDate     DateTime        │
│  coverImage  String?         │
│  status      String          │
│  createdBy   String          │
│  createdAt   DateTime        │
│  updatedAt   DateTime        │
├──────────────────────────────┤
│  registrations Registration[]│
│  announcements Announcement[]│
└──────────────┬───────────────┘
               │ 1
               │
               │ *
               ▼
┌──────────────────────────────┐
│        Announcement          │
├──────────────────────────────┤
│  id          String (cuid)   │
│  title       String          │
│  content     String          │
│  eventId     String? (FK)    │──┘
│  priority    String          │
│  createdBy   String          │
│  createdAt   DateTime        │
│  updatedAt   DateTime        │
└──────────────────────────────┘
```

---

## API Reference

Base: `http://localhost:5000/api` (dev) or `http://176.100.36.169:4001/api` (production)

Standard response format:
```json
{ "success": true, "data": { ... }, "message": "..." }
{ "success": false, "error": "..." }
```

### Auth

| Method | Endpoint           | Auth     | Description          |
| ------ | ------------------ | -------- | -------------------- |
| POST   | `/auth/register`   | No       | Create account       |
| POST   | `/auth/login`      | No       | Sign in              |
| GET    | `/auth/me`         | Bearer   | Get current user     |

**POST /auth/register**
```json
{ "name": "Jane Smith", "email": "jane@school.edu", "password": "secret123", "role": "student" }
// → { success: true, data: { user: {...}, token: "eyJ..." } }
```

**POST /auth/login**
```json
{ "email": "jane@school.edu", "password": "secret123" }
// → { success: true, data: { user: {...}, token: "eyJ..." } }
```

### Events

| Method | Endpoint           | Auth             | Description        |
| ------ | ------------------ | ---------------- | ------------------ |
| GET    | `/events`          | No               | List events        |
| GET    | `/events/:id`      | No               | Get event details  |
| POST   | `/events`          | Admin/Teacher    | Create event       |
| PUT    | `/events/:id`      | Admin/Teacher    | Update event       |
| DELETE | `/events/:id`      | Admin            | Delete event       |

**GET /events** — Query params: `type`, `status`, `search`
```
GET /events?type=debate&status=upcoming&search=spring
```

### Registrations

| Method | Endpoint                    | Auth     | Description              |
| ------ | --------------------------- | -------- | ------------------------ |
| POST   | `/registrations`            | Bearer   | Register for event       |
| GET    | `/registrations/mine`       | Bearer   | My registrations         |
| PUT    | `/registrations/:id/checkin`| Bearer   | Check-in (scan QR)       |

**POST /registrations**
```json
{ "eventId": "abc123", "ticketType": "attendee" }
// → { success: true, data: { id: "...", qrCode: "uuid-here", event: {...} } }
```

### Announcements

| Method | Endpoint                      | Auth             | Description              |
| ------ | ----------------------------- | ---------------- | ------------------------ |
| GET    | `/announcements`              | No               | List announcements       |
| GET    | `/announcements/event/:eventId` | No             | By event                 |
| POST   | `/announcements`              | Admin/Teacher    | Create announcement      |
| DELETE | `/announcements/:id`          | Admin            | Delete                   |

**GET /announcements** — Query param: `priority` (`low`, `medium`, `high`, `urgent`)

---

## Frontend Routes

| Route               | Description                              |
| ------------------- | ---------------------------------------- |
| `/`                 | Landing page (hero, features, CTA)       |
| `/login`            | Sign in (no header/footer)               |
| `/register`         | Create account (no header/footer)        |
| `/events`           | Browse events with search & filters      |
| `/events/[id]`      | Event detail + registration + announcements |
| `/my-registrations` | Dashboard with QR tickets                |
| `/announcements`    | Priority-filtered announcements list     |

---

## How It Works

### For Students
1. **Browse** — Visit `/events` to see everything happening. Filter by type (debate, sports, cultural…) and status (upcoming, ongoing).
2. **Register** — Click any event, hit "Register for this event", get an instant QR ticket.
3. **Attend** — Show your QR code at the door. Organizers scan it for check-in.
4. **Stay updated** — Announcements and live updates appear right on the event page.

### For Teachers/Admins
1. **Create events** via API (admin endpoints).
2. **Push announcements** — Tag them with priority levels (low → urgent). Urgent ones pop in red.
3. **Check in attendees** — Scan QR codes to mark attendance.
4. **Keep everyone informed** — Post live updates during events.

### For Parents
1. **Track registrations** — See what your child has signed up for.
2. **Get announcements** — Priority-filtered view of all school communications.

---

## Setup

### Prerequisites
- Node.js 20+
- npm

### Backend

```bash
cd backend
npm install
cp .env.example .env   # Edit as needed
npx prisma generate
npx prisma db push
npm run db:seed        # Seeds 3 users, 6 events, 5 announcements
npm run dev            # Starts on port 5000
```

#### Seed users (password: `password123`)
| Email              | Role    |
| ------------------ | ------- |
| admin@school.edu   | admin   |
| teacher@school.edu | teacher |
| student@school.edu | student |

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # Set NEXT_PUBLIC_API_URL
npm run dev                        # Starts on port 3000
```

### Environment Variables

**Backend `.env`**
```
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-here"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:3000"
```

**Frontend `.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Deployment (VPS)

```bash
git pull
./run.sh full     # First time: install → generate → push → seed → build → start
./run.sh update   # After pulls: generate → push → build → start
./run.sh seed     # Re-seed the database
./run.sh dev      # Dev mode with nodemon
```

The backend runs at `http://176.100.36.169:4001`. The frontend is built locally (`npm run build`) and deployed as static export or served via Next.js standalone.

---

## Design Notes

- **No Tailwind** — all styles are inline objects + `<style>` blocks with CSS custom properties.
- **Monochrome** — grayscale palette (`--gray-50` through `--gray-950`) with pure black and white.
- **Animations** — framer-motion for reveals, staggers, page transitions, and micro-interactions.
- **Lazy loading** — landing page sections are `lazy()` loaded for fast initial paint.
- **Responsive** — mobile hamburger menu, fluid typography (`clamp()`), adaptive grids.
- **Auth-aware** — Header conditionally shows Sign in/Get started vs. My registrations/Sign out. Auth pages skip header/footer entirely via route group `(auth)`.

---

## Project Structure

```
EventX/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    # Data models
│   │   ├── seed.ts          # Seed data
│   │   └── dev.db           # SQLite file (gitignored)
│   ├── src/
│   │   ├── app.ts           # Express server entry
│   │   ├── config/          # Env config
│   │   ├── controllers/     # Route handlers
│   │   ├── lib/             # Prisma client
│   │   ├── middlewares/     # Auth, validation, error handling
│   │   ├── routes/          # Express routers
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Response helpers
│   ├── run.sh               # Deploy script
│   ├── tsconfig.json
│   └── tsconfig.seed.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/      # Login & register (no chrome)
│   │   │   ├── events/      # Browse & detail
│   │   │   ├── announcements/
│   │   │   ├── my-registrations/
│   │   │   ├── layout.tsx   # Root layout
│   │   │   ├── auth-aware-layout.tsx  # Conditional chrome
│   │   │   ├── page.tsx     # Landing page
│   │   │   └── not-found.tsx
│   │   ├── components/
│   │   │   ├── landing/     # Hero, Features, HowItWorks, Stats, CTA
│   │   │   ├── layout/      # Header, Footer
│   │   │   ├── ui/          # Reveal, StaggerContainer, Shimmer, etc.
│   │   │   └── auth/
│   │   ├── hooks/useAuth.ts # Auth state management
│   │   ├── lib/             # API client, date utils
│   │   ├── services/        # API service objects
│   │   └── types/           # TypeScript interfaces
│   ├── next.config.ts       # API proxy rewrites
│   └── package.json
└── .gitignore
```

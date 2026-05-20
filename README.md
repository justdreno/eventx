# EventX

> The unified command center for school events. From debates to cultural fests — schedules, registrations, announcements, and live updates under one roof.

Built with **Next.js 16**, **Express 5**, **Prisma**, **SQLite**, and **framer-motion**.

---

## Architecture

![Architecture](https://mermaid.ink/img/Z3JhcGggVEIKICAgIHN1YmdyYXBoIEJyb3dzZXJbQnJvd3Nlcl0KICAgICAgICBMW0xhbmRpbmcgUGFnZV0KICAgICAgICBFW0V2ZW50cyBCcm93c2VdCiAgICAgICAgUltNeSBSZWdpc3RyYXRpb25zXQogICAgICAgIEFbQW5ub3VuY2VtZW50c10KICAgIGVuZAogICAgc3ViZ3JhcGggTmV4dFtOZXh0LmpzIEFwcCBSb3V0ZXJdCiAgICAgICAgQUNbQVBJIENsaWVudF0KICAgICAgICBKV1RbQXV0aCBKV1RdCiAgICBlbmQKICAgIHN1YmdyYXBoIEV4cHJlc3NbRXhwcmVzcyBBUEkgU2VydmVyXQogICAgICAgIEF1dGhSW0F1dGggUm91dGVzXQogICAgICAgIEV2ZW50UltFdmVudCBSb3V0ZXNdCiAgICAgICAgUmVnUltSZWdpc3RyYXRpb24gUm91dGVzXQogICAgICAgIEFublJbQW5ub3VuY2VtZW50IFJvdXRlc10KICAgIGVuZAogICAgREJbKFNRTGl0ZSBEYXRhYmFzZSldCiAgICBMIC0tPiBBQwogICAgRSAtLT4gQUMKICAgIFIgLS0+IEFDCiAgICBBIC0tPiBBQwogICAgQUMgLS0+IEV4cHJlc3MKICAgIEpXVCAtLT4gRXhwcmVzcwogICAgQXV0aFIgLS0+IERCCiAgICBFdmVudFIgLS0+IERCCiAgICBSZWdSIC0tPiBEQgogICAgQW5uUiAtLT4gREINCg==)

### Data Flow — Auth

![Auth Flow](https://mermaid.ink/img/c2VxdWVuY2VEaWFncmFtCiAgICBwYXJ0aWNpcGFudCBVIGFzIFVzZXIKICAgIHBhcnRpY2lwYW50IEZFIGFzIEZyb250ZW5kCiAgICBwYXJ0aWNpcGFudCBCRSBhcyBCYWNrZW5kCiAgICBwYXJ0aWNpcGFudCBEQiBhcyBTUUxpdGUKICAgIFUtPj5GRTogUmVnaXN0ZXIgLyBMb2dpbgogICAgRkUtPj5CRTogUE9TVCAvYXV0aC9yZWdpc3RlciBvciAvYXV0aC9sb2dpbgogICAgQkUtPj5CRTogYmNyeXB0IGhhc2ggLyBjb21wYXJlCiAgICBCRS0+PkRCOiBDcmVhdGUgLyBGaW5kIHVzZXIKICAgIERCLS0+PkJFOiBVc2VyIGRhdGEKICAgIEJFLT4+QkU6IGp3dC5zaWduKHVzZXJJZCwgcm9sZSkKICAgIEJFLS0+PkZFOiB7IHVzZXIsIHRva2VuIH0KICAgIEZFLT4+RkU6IFN0b3JlIGluIGxvY2FsU3RvcmFnZQogICAgRkUtPj5GRTogUmVkaXJlY3QgdG8gL2V2ZW50cw0K)

### Data Flow — Registration

![Registration Flow](https://mermaid.ink/img/c2VxdWVuY2VEaWFncmFtCiAgICBwYXJ0aWNpcGFudCBTIGFzIFN0dWRlbnQKICAgIHBhcnRpY2lwYW50IEZFIGFzIEZyb250ZW5kCiAgICBwYXJ0aWNpcGFudCBCRSBhcyBCYWNrZW5kCiAgICBwYXJ0aWNpcGFudCBEQiBhcyBTUUxpdGUKICAgIFMtPj5GRTogQ2xpY2sgUmVnaXN0ZXIKICAgIEZFLT4+QkU6IFBPU1QgL3JlZ2lzdHJhdGlvbnMgKEpXVCkKICAgIEJFLT4+REI6IENoZWNrIGV2ZW50IGV4aXN0cwogICAgQkUtPj5EQjogQ2hlY2sgbm90IGR1cGxpY2F0ZQogICAgQkUtPj5CRTogY3J5cHRvLnJhbmRvbVVVSUQoKQogICAgTm90ZSBvdmVyIEJFOiBHZW5lcmF0ZXMgdW5pcXVlIFFSIGNvZGUKICAgIEJFLT4+REI6IElOU0VSVCByZWdpc3RyYXRpb24KICAgIERCLS0+PkJFOiBSZWdpc3RyYXRpb24KICAgIEJFLS0+PkZFOiB7IHFyQ29kZSwgZXZlbnQgfQogICAgRkUtPj5GRTogUmVuZGVyIFFSIHZpYSBhcGkucXJzZXJ2ZXIuY29tCiAgICBTLT4+UzogU2hvdyBRUiBhdCB2ZW51ZQogICAgRkUtPj5CRTogUFVUIC9yZWdpc3RyYXRpb25zLzppZC9jaGVja2luCiAgICBCRS0+PkRCOiBVUERBVEUgY2hlY2tlZEluPXRydWUKICAgIERCLS0+PkJFOiBTdWNjZXNzCiAgICBCRS0tPj5GRTogeyBjaGVja2VkSW46IHRydWUgfQ0K)

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

![Schema](https://mermaid.ink/img/ZXJEaWFncmFtCiAgICBVc2VyIHx8LS1veyBSZWdpc3RyYXRpb24gOiBoYXMKICAgIEV2ZW50IHx8LS1veyBSZWdpc3RyYXRpb24gOiBoYXMKICAgIEV2ZW50IHx8LS1veyBBbm5vdW5jZW1lbnQgOiBoYXMKICAgIFVzZXIgewogICAgICAgIHN0cmluZyBpZCBQSwogICAgICAgIHN0cmluZyBuYW1lCiAgICAgICAgc3RyaW5nIGVtYWlsIFVLCiAgICAgICAgc3RyaW5nIHBhc3N3b3JkCiAgICAgICAgc3RyaW5nIHJvbGUKICAgIH0KICAgIEV2ZW50IHsKICAgICAgICBzdHJpbmcgaWQgUEsKICAgICAgICBzdHJpbmcgdGl0bGUKICAgICAgICBzdHJpbmcgZGVzY3JpcHRpb24KICAgICAgICBzdHJpbmcgdHlwZQogICAgICAgIHN0cmluZyB2ZW51ZQogICAgICAgIGRhdGV0aW1lIHN0YXJ0RGF0ZQogICAgICAgIGRhdGV0aW1lIGVuZERhdGUKICAgICAgICBzdHJpbmcgc3RhdHVzCiAgICB9CiAgICBSZWdpc3RyYXRpb24gewogICAgICAgIHN0cmluZyBpZCBQSwogICAgICAgIHN0cmluZyBldmVudElkIEZLCiAgICAgICAgc3RyaW5nIHVzZXJJZCBGSwogICAgICAgIHN0cmluZyBxckNvZGUgVUsKICAgICAgICBib29sZWFuIGNoZWNrZWRJbgogICAgICAgIGRhdGV0aW1lIHJlZ2lzdGVyZWRBdAogICAgfQogICAgQW5ub3VuY2VtZW50IHsKICAgICAgICBzdHJpbmcgaWQgUEsKICAgICAgICBzdHJpbmcgdGl0bGUKICAgICAgICBzdHJpbmcgY29udGVudAogICAgICAgIHN0cmluZyBldmVudElkIEZLCiAgICAgICAgc3RyaW5nIHByaW9yaXR5CiAgICAgICAgZGF0ZXRpbWUgY3JlYXRlZEF0CiAgICB9DQo=)

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

## Deployment

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

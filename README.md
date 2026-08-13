# PavanxDCL Monorepo App

This project is refactored into a clean, production-ready monorepo structure. It separates the user-facing student website and the admin dashboard panel into independent React + Vite applications connected to a single Express + PostgreSQL/SQLite backend.

## Architecture Layout

```
pavanxdcl/
├── shared/            # Shared static data, TS types, common utils & schemas
│   ├── data/          # questions.json, dsaVideos.ts, fullstackVideos.ts
│   ├── types/         # Master TypeScript Interfaces
│   ├── utils/         # ID and Date Formatter helpers
│   ├── constants/     # Workspace constants
│   └── validation/    # Credential validators
│
├── backend/           # Express.js API + Prisma DB ORM (Default: PostgreSQL)
│   ├── prisma/        # schema.prisma & seed.ts
│   └── src/           # server, controllers, middleware, routes
│
├── frontend/          # Student portal (React + Vite, Port 5173)
│   ├── src/           # main pages, components, context, services API
│   └── public/
│
├── admin/             # Admin control panel (React + Vite, Port 5174)
│   ├── src/           # control dashboard pages, layouts, context, services API
│   └── public/
│
├── package.json       # Monorepo bootstrapper configuration
├── .gitignore         # Workspace gitignore rules
└── README.md          # Documentation (this file)
```

---

## Prerequisites

Before building or launching the applications, ensure you have:
- **Node.js** (v18 or higher recommended)
- **NPM** (v9 or higher)
- **PostgreSQL** database running (for production database mode).

---

## Local Setup & Development

### 1. Install Dependencies
Run the command in the root folder to automatically install node packages across all monorepo workspaces:
```bash
npm run install:all
```

### 2. Configure Database & Environment
Configure the environment variables in each workspace:

#### Backend (`backend/.env`)
Create `backend/.env` file:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pavanxdcl?schema=public"
JWT_SECRET="pavanxdcl_jwt_super_secure_secret_2026_xyz"
```
> [!TIP]
> **To use SQLite for local development**:
> 1. Open [backend/prisma/schema.prisma](file:///c:/Users/darsh/OneDrive/Desktop/pavanxdcl/backend/prisma/schema.prisma) and change `provider = "postgresql"` to `provider = "sqlite"`.
> 2. Change `DATABASE_URL` in [backend/.env](file:///c:/Users/darsh/OneDrive/Desktop/pavanxdcl/backend/.env) to `"file:./dev.db"`.

#### Frontend Client (`frontend/.env`)
Create `frontend/.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

#### Admin Dashboard (`admin/.env`)
Create `admin/.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Initialize & Seed Database
Setup the database tables and apply initial seed scripts (which create the default admin account `admin@pavanxdcl.in` with securely encrypted password `PavanAdmin@2026` and load default DSA modules and Aptitude questions):
```bash
cd backend
npx prisma db push
npm run prisma:seed
cd ..
```

### 4. Launch Development Servers
Run the following boot command in the root folder to start the backend, frontend portal, and admin dashboard simultaneously:
```bash
npm run dev
```
- **Backend Service**: [http://localhost:5000](http://localhost:5000)
- **Student Website**: [http://localhost:5173](http://localhost:5173)
- **Admin Dashboard**: [http://localhost:5174](http://localhost:5174)

---

## Production Build

To compile all applications for deployment, run:
```bash
npm run build
```
This builds:
- Frontend into `frontend/dist`
- Admin Dashboard into `admin/dist`
- Backend compiled TypeScript files into `backend/dist`

---

## Verification & Checks
To verify that everything is configured correctly:
1. Ensure `npm run build` succeeds across all workspaces.
2. Confirm there are no broken imports or compilation errors.
3. Validate CORS setup permits independent cross-origin client queries.

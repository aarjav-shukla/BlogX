# 📝 Medium - Modern Full-Stack Blogging Platform

A high-performance, feature-rich Medium clone built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Hono.js**, **Cloudflare Workers**, **Prisma ORM**, and **PostgreSQL**.

Featuring a monorepo architecture with end-to-end type safety enabled by shared **Zod** schemas between the frontend and serverless edge backend.

---

## 🌟 Highlights & Features

- 🎨 **Modern Editorial Design**: Elegant, reader-focused user interface featuring customizable magazine-style layouts (*Fyrre* & *Gazette* themes).
- ⚡ **Serverless Edge Backend**: Built on **Hono.js** and deployed to **Cloudflare Workers** for ultra-low latency globally.
- 🛡️ **End-to-End Type Safety**: Shared NPM/local package (`/common`) containing **Zod** validation schemas shared seamlessly across client and server.
- 🗄️ **High-Performance Database**: Powered by **PostgreSQL** and **Prisma ORM** with **Prisma Accelerate** for connection pooling and caching.
- 🔒 **Authentication & Authorization**: Secure user registration & login using JWT (JSON Web Tokens) with route middleware protection.
- ✍️ **Content Management**: Seamless article creation, real-time modal reader view, article editing, and author profiles.
- 🔍 **Interactive Discovery**: Dynamic content search, tag-based filtering, estimated reading times, and responsive layouts.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, React Router v7, Axios |
| **Backend** | Hono.js, Cloudflare Workers (Wrangler), JWT Authentication |
| **Database & ORM** | PostgreSQL, Prisma ORM, Prisma Accelerate |
| **Validation & Shared** | Zod, `@aarjav-shukla/medium-common` |
| **Tooling & Infra** | TypeScript, ESLint, npm Workspaces |

---

## 📁 Repository Structure

```text
Medium/
├── Frontend/                 # React 19 + Vite + Tailwind CSS Application
│   ├── src/
│   │   ├── components/       # Layouts (Fyrre, Gazette), Modals, Navbar
│   │   ├── pages/            # Home, Signin, Signup, Profile, Blog pages
│   │   ├── config/           # API Endpoints & Axios config
│   │   └── types/            # Frontend TypeScript definitions
│   ├── index.html
│   └── package.json
│
├── backend/                  # Serverless Hono API on Cloudflare Workers
│   ├── prisma/
│   │   └── schema.prisma     # Prisma Data Models (User, Blog)
│   ├── src/
│   │   ├── routes/           # User & Blog API routes
│   │   └── index.ts          # Main Hono application entrypoint
│   ├── wrangler.json / .toml # Cloudflare Workers configuration
│   └── package.json
│
├── common/                   # Shared Zod schemas & TypeScript types package
│   ├── src/
│   │   └── index.ts          # Zod input validation schemas
│   └── package.json
│
├── package.json              # Monorepo root configuration
└── README.md                 # Project Documentation
```

---

## 🔑 Database Schema

### User Model
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `name`: String (Optional)
- `password`: String (Hashed/Secured)
- `blogs`: Array of `Blog`

### Blog Model
- `id`: Int (Autoincrement Primary Key)
- `title`: String
- `content`: String
- `published`: Boolean (Default: `false`)
- `authorId`: UUID (Foreign Key -> User)

---

## 📡 API Endpoints

### 🔐 User Routes (`/api/v1/user`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Register a new user account | ❌ No |
| `POST` | `/signin` | Authenticate user & return JWT token | ❌ No |

### 📰 Blog Routes (`/api/v1/blog`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/bulk` | Fetch all published blog posts | ❌ No (Optional JWT) |
| `GET` | `/:id` | Fetch specific blog post by ID | ❌ No (Optional JWT) |
| `POST` | `/` | Create a new blog post | 🔐 Yes (JWT Header) |
| `PUT` | `/` | Update an existing blog post | 🔐 Yes (JWT Header) |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- **PostgreSQL** database instance (or a hosted database provider like Supabase / Neon / Aiven)
- **Cloudflare Account** (optional, for deploying worker backend)

---

### Setup & Installation

#### 1. Clone the repository
```bash
git clone https://github.com/aarjav-shukla/Medium.git
cd Medium
```

#### 2. Setup Shared Module (`/common`)
```bash
cd common
npm install
npm run build
cd ..
```

#### 3. Setup Backend (`/backend`)
```bash
cd backend
npm install
```

Configure your environment variables in `backend/wrangler.json` (or `.dev.vars` / `.env`):
```ini
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
JWT_SECRET="your_secret_jwt_key"
```

Generate Prisma client & run migrations:
```bash
npx prisma db push
npx prisma generate
```

Start the backend serverless dev server:
```bash
npm run dev
# Running on http://localhost:8787
```

#### 4. Setup Frontend (`/Frontend`)
```bash
cd ../Frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
# Running on http://localhost:5173
```

---

## 🧪 Development Scripts Summary

### Backend (`/backend`)
- `npm run dev`: Starts local Cloudflare Worker development server (`wrangler dev`).
- `npm run deploy`: Deploys the backend application to Cloudflare Workers (`wrangler deploy`).
- `npx prisma studio`: Launches visual database GUI inspector.

### Frontend (`/Frontend`)
- `npm run dev`: Launches Vite dev server with Hot Module Replacement.
- `npm run build`: Compiles TypeScript and builds production bundles.
- `npm run preview`: Previews production build locally.

---

## 🛡️ Input Validation with Zod

Both frontend and backend rely on `@aarjav-shukla/medium-common` for guaranteed type synchronization:

```ts
import { signupInput, createBlog } from "@aarjav-shukla/medium-common";

// Example frontend form payload validation
const result = signupInput.safeParse({ email, password, username });
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

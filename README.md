# BlogX

A full-stack blogging platform inspired by Medium, built to provide a clean and simple experience for writing, publishing, and discovering blog posts.

## 🚀 Overview

**BlogX** is a Medium-inspired blog application where users can create accounts, write and publish articles, and explore content from other users.

The project was built to understand how a modern full-stack application works — from designing REST APIs and managing authentication to connecting a frontend with a PostgreSQL database using Prisma.

## ✨ Features

* 🔐 User authentication
* 📝 Create and publish blog posts
* 📖 Read published articles
* 👤 User profiles
* ✏️ Edit and manage your posts
* 🗑️ Delete posts
* 🔍 Browse available articles
* 📱 Responsive interface
* ⚡ REST API based backend
* 🗄️ PostgreSQL database
* 🔄 Prisma ORM for database operations

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* REST API

### Database

* PostgreSQL
* Prisma ORM

### Authentication & Security

* JWT authentication
* Password hashing
* Protected API routes

## 🏗️ Architecture

```text
                 ┌──────────────────┐
                 │     React        │
                 │    Frontend      │
                 └────────┬─────────┘
                          │
                          │ HTTP / REST API
                          ▼
                 ┌──────────────────┐
                 │   Node.js +      │
                 │    Express      │
                 └────────┬─────────┘
                          │
                          │ Prisma
                          ▼
                 ┌──────────────────┐
                 │   PostgreSQL     │
                 │    Database      │
                 └──────────────────┘
```

## 📂 Project Structure

```text
BlogX/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.tsx
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.ts
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   └── package.json
│
└── README.md
```

> The exact structure may vary depending on the current implementation.

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>

cd BlogX
```

### 2. Install dependencies

Install dependencies for the frontend:

```bash
cd frontend
npm install
```

Install dependencies for the backend:

```bash
cd ../backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the backend directory:

```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_jwt_secret"
```

### 4. Setup Prisma

Run the Prisma migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

### 5. Start the backend

```bash
npm run dev
```

### 6. Start the frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The application will then be available through the local development URL shown by Vite.

## 🔑 Authentication Flow

BlogX uses token-based authentication.

```text
User
 │
 │ Sign Up / Sign In
 ▼
Backend API
 │
 │ Verify credentials
 ▼
JWT generated
 │
 ▼
Authenticated requests
 │
 ▼
Protected API routes
```

Passwords are hashed before being stored in the database, while JWTs are used to authenticate protected requests.

## 🗄️ Database

PostgreSQL is used as the primary database, with Prisma acting as the ORM.

The database stores information such as:

* Users
* Blog posts
* Post metadata
* Relationships between users and posts

Example relationship:

```text
User
 │
 ├── Post
 ├── Post
 └── Post
```

One user can create multiple blog posts.

## 🔌 API

The backend exposes REST APIs for operations such as:

```text
POST   /api/auth/signup
POST   /api/auth/signin

GET    /api/blog
GET    /api/blog/:id

POST   /api/blog
PUT    /api/blog/:id
DELETE /api/blog/:id
```

> API routes may differ slightly depending on the current implementation.

## 🧠 What I Learned

Building BlogX helped me understand several concepts involved in full-stack development:

* Building REST APIs
* React frontend architecture
* Connecting frontend and backend
* PostgreSQL database design
* Prisma ORM
* Authentication and authorization
* JWT-based authentication
* Password hashing
* API request handling with Axios
* Database migrations
* Environment variables
* Structuring a full-stack application

## 🔮 Future Improvements

Some features that can be added in the future:

* 💬 Comments
* ❤️ Likes and reactions
* 🔖 Bookmarking articles
* 🔍 Advanced search
* 🏷️ Categories and tags
* 👥 Follow users
* 📊 Reading statistics
* 🖼️ Image uploads
* 🌙 Dark mode
* ✨ Rich-text editor
* 📧 Email notifications

## 📸 Screenshots

Add screenshots of the application here:

```text
screenshots/
├── home.png
├── article.png
├── login.png
└── profile.png
```

## 📌 Project Status

🚧 **Active Development**

BlogX is primarily a learning project focused on understanding full-stack development and applying modern web technologies to a real-world application.

## 👨‍💻 Author

**Aarjav Shukla**

B.Tech CSE — IIIT Sonepat

Interested in:

* Full-Stack Development
* Open Source
* DSA
* Web3

---

⭐ If you found this project interesting, consider giving it a star!

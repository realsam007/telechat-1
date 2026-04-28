# TeleChat – Real-Time Chat Application

A full-stack real-time chat application built with **React.js**, **Node.js**, **Express.js**, **Socket.io**, and **MongoDB**.

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React.js (Vite), Socket.io-client   |
| Backend  | Node.js, Express.js, Socket.io      |
| Database | MongoDB, Mongoose                   |

---

## Features

- ✅ Real-time messaging with Socket.io
- ✅ Multiple chat rooms (global, tech, gaming, custom)
- ✅ Message timestamps
- ✅ Typing indicators
- ✅ Online users list
- ✅ Message history (persisted in MongoDB)
- ✅ Join/leave notifications
- ✅ Structured error handling
- ✅ Responsive UI

---

## Prerequisites

- Node.js v18+ → https://nodejs.org
- MongoDB Community → https://www.mongodb.com/try/download/community

---

## Local Setup

### 1. Clone / download the project

```bash
cd telechat
```

### 2. Start MongoDB

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Windows — start from Services or run:
mongod

# Linux
sudo systemctl start mongod
```

### 3. Setup & run the backend

```bash
cd server
cp .env.example .env      # copy env file
npm install
npm run dev               # runs on http://localhost:5000
```

### 4. Setup & run the frontend (new terminal)

```bash
cd client
npm install
npm run dev               # runs on http://localhost:5173
```

### 5. Open the app

Visit **http://localhost:5173** in your browser.

---

## Deployment (Render — Free Tier)

### Deploy Backend to Render

1. Push your code to GitHub
2. Go to https://render.com → New → **Web Service**
3. Connect your repo, set **Root Directory** to `server`
4. Build command: `npm install`
5. Start command: `node index.js`
6. Add environment variables:
   - `MONGO_URL` → your MongoDB Atlas connection string
   - `CLIENT_URL` → your frontend URL (after deploying frontend)
   - `NODE_ENV` → `production`

### Deploy Frontend to Vercel / Netlify

1. Go to https://vercel.com → New Project → import your repo
2. Set **Root Directory** to `client`
3. Add environment variable:
   - `VITE_SERVER_URL` → your Render backend URL
4. Deploy

---

## MongoDB Atlas (Cloud DB for deployment)

1. Go to https://cloud.mongodb.com → Create free cluster
2. Create a database user
3. Whitelist IP: `0.0.0.0/0` (allow all for deployment)
4. Copy the connection string → paste as `MONGO_URL` in Render

---

## Project Structure

```
telechat/
├── server/
│   ├── models/
│   │   └── Message.js       # Mongoose schema (from, to, text, room, timestamps)
│   ├── index.js             # Express + Socket.io server
│   ├── .env.example
│   └── package.json
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── LoginScreen.jsx   # Username + room selection
    │   │   ├── ChatRoom.jsx      # Main chat layout
    │   │   ├── MessageBubble.jsx # Message, DateDivider, SystemMessage
    │   │   ├── MessageInput.jsx  # Input bar with typing emit
    │   │   └── Sidebar.jsx       # Online users + room info
    │   ├── hooks/
    │   │   └── useSocket.js      # Custom React hook for Socket.io
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

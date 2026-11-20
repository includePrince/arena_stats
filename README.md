# Arena Stats — MERN Esports Team Dashboard

A full-stack MERN application for team managers to manage a roster, record match results, and analyze player/team performance.

## Stack
- MongoDB + Mongoose
- Express + Node.js
- React + Vite
- React Router, Axios, Recharts, Lucide React
- JWT authentication, bcrypt password hashing
- Multer for team logo uploads

## Requirements
- Node.js 18+
- MongoDB local instance or MongoDB Atlas connection string

## Setup

### 1. Backend
```bash
cd server
cp .env.example .env
# Set MONGO_URI and JWT_SECRET in .env
npm install
npm run dev
```
The API runs at `http://localhost:5000`.

### 2. Frontend
Open a second terminal:
```bash
cd client
npm install
npm run dev
```
Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

## Main features
- Manager registration and login
- First-login team setup, editable team profile and roster (up to 6 players)
- Team logo upload
- Match entry with match type, map, total teams, placement and kills for each current roster member
- Match history and match deletion
- Player and team statistics for all-time, weekly, monthly and yearly periods
- Charts for kills, placement, match volume and player contribution
- Protected API routes; each manager can access only their own team and matches

## Notes
- Player kill inputs are ordered to match the roster shown on the form. Player names are intentionally not entered for every match.
- Editing a roster later does not rewrite historical match kill attribution. Match records store a snapshot of player names and kills at the time they were submitted.
- Uploaded logos are stored in `server/uploads`. For production, replace local disk uploads with object storage and configure HTTPS, rate limiting, secure cookies, and a production-grade secret.
- This starter does not include OCR/screenshot parsing; match details are entered using the form.

## API overview
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/team`
- `POST /api/team`
- `PUT /api/team`
- `POST /api/team/logo`
- `POST /api/matches`
- `GET /api/matches`
- `DELETE /api/matches/:id`
- `GET /api/stats/summary?period=all|week|month|year`
- `GET /api/stats/players?period=all|week|month|year`

All `/api/team`, `/api/matches`, and `/api/stats` routes require `Authorization: Bearer <token>`.

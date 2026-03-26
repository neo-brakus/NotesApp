# NotesApp

A lightweight full-stack note-taking application built for learning purposes.

## Overview

NotesApp is a simple CRUD application that allows users to create, read, update, and delete notes. All notes are global and visible to every user. The interface consists of a sidebar listing all existing notes and a main panel for viewing and editing note content.

## Features

- View all notes in a collapsible sidebar
- Select a note to read its full content
- Create new notes
- Edit and save existing notes
- Delete notes with a confirmation step
- Responsive layout with mobile support

## Tech Stack

**Frontend:** React, Tailwind CSS

**Backend:** Node.js, Express, CORS, dotenv, pg (PostgreSQL)

## Project Structure

```
backend/
  src/
    routes/
      notes.ts       # CRUD router for notes
    db.ts            # PostgreSQL connection
    server.ts        # Express server entry point

frontend/
  src/
    App.tsx          # All app logic and UI
    index.css
    main.tsx
    theme.ts

db/
  init.sql           # Database schema, auto-run by Docker on first startup

docker-compose.yml
```

---

## Running with Docker (recommended)

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop)

### Steps

1. Copy the example env file and fill in your values:
   ```bash
   cp .env.example .env
   ```

2. Build and start all services:
   ```bash
   docker compose up --build
   ```

The frontend is available at `http://localhost:5173` and the backend API at `http://localhost:3000`. The database is created and seeded automatically on first startup.

On subsequent runs you can skip the `--build` flag:
```bash
docker compose up
```

To stop everything:
```bash
docker compose down
```

To stop everything and remove volumes (deletes DB data):
```bash
docker compose down -v
```

---

## Running without Docker

### Prerequisites

- Node.js
- A running PostgreSQL instance

### Setup

1. Copy the example env file for the backend and fill in your database connection details:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Create the database table by running `db/init.sql` against your PostgreSQL instance.

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend API at `http://localhost:3000`.
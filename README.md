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
```

## Getting Started

### Prerequisites

- Node.js
- A running PostgreSQL instance
- A `.env` file in `backend/` with your database connection details

### Backend

```bash
cd backend
npm install
npx ts-node src/server.ts
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default. The backend API is expected at `http://localhost:3000`.

import dotenv from 'dotenv';

// Load local .env file only if not running inside Docker
if (process.env.DOCKER === undefined) {
  dotenv.config();
}

import express from "express"
import cors from "cors"
import notesRoutes from "./routes/notes"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api", notesRoutes)

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
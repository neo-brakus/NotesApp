import { Router } from "express"
import { pool } from "../db"

const router = Router()

// GET all notes
router.get("/notes", async (req, res) => {
  const result = await pool.query("SELECT * FROM notes ORDER BY id")
  res.json(result.rows)
})

// CREATE note
router.post("/notes", async (req, res) => {
  const { title, content } = req.body

  const result = await pool.query(
    "INSERT INTO notes(title, content) VALUES($1, $2) RETURNING *",
    [title, content]
  )

  res.json(result.rows[0])
})

// DELETE note
router.delete("/notes/:id", async (req, res) => {
  const { id } = req.params

  await pool.query("DELETE FROM notes WHERE id=$1", [id])

  res.json({ message: "deleted" })
})

export default router
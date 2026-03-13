import { useEffect, useState } from "react"

type Note = {
  id: number
  title: string
  content: string
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    fetch("http://localhost:3000/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <div className="flex h-screen">
      
      {/* Notes sidebar */}
      <div className="w-80 border-r p-4 overflow-y-auto">
        <h1 className="text-xl font-semibold mb-4">Notes</h1>

        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-xl border border-gray-200 transition cursor-pointer"
            >
              <h2 className="font-semibold text-gray-800 mb-1">
                {note.title}
              </h2>

              <p className="text-sm text-gray-600 line-clamp-2">
                {note.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main content placeholder */}
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a note
      </div>

    </div>
  )
}
import { useEffect, useState, useRef } from "react"
import { colors } from "./theme"

type Note = {
  id: number
  title: string
  content: string
}

type Mode = "edit" | "new"

export default function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selected, setSelected] = useState<Note | null>(null)
  const [mode, setMode] = useState<Mode | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [saving, setSaving] = useState(false)
  // Controls the two-step delete confirmation flow
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  // Ref for the backdrop overlay — used for click-outside-to-close on mobile
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchNotes()
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // On mobile, sidebar starts closed if a note is selected
      if (mobile) setSidebarOpen(true)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  function fetchNotes() {
    fetch("http://localhost:3000/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error(err))
  }

  // Returns the 1-based position of a note in the list
  function noteIndex(noteId: number): number {
    const idx = notes.findIndex((n) => n.id === noteId)
    return idx === -1 ? 1 : idx + 1
  }

  function selectNote(note: Note) {
    setSelected(note)
    setEditTitle(note.title)
    setEditContent(note.content)
    setMode("edit")
    setDeleteConfirm(false)
    // On mobile, close sidebar after selecting
    if (isMobile) setSidebarOpen(false)
  }

  function startNew() {
    setSelected(null)
    setEditTitle("")
    setEditContent("")
    setMode("new")
    setDeleteConfirm(false)
    if (isMobile) setSidebarOpen(false)
  }

  async function saveNote() {
    setSaving(true)
    try {
      if (mode === "new") {
        // POST a new note and add it to local state
        const res = await fetch("http://localhost:3000/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: editTitle, content: editContent }),
        })
        const newNote = await res.json()
        setNotes([...notes, newNote])
        setSelected(newNote)
        // Switch to edit mode so subsequent saves use PUT
        setMode("edit")
      } else if (mode === "edit" && selected) {
        // PUT the updated note; errors are silently swallowed so local state
        // still reflects the edit even if the server request fails
        await fetch(`http://localhost:3000/api/notes/${selected.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: editTitle, content: editContent }),
        }).catch(() => null)

        const updatedNote: Note = { ...selected, title: editTitle, content: editContent }
        setNotes(notes.map((n) => (n.id === selected.id ? updatedNote : n)))
        setSelected(updatedNote)
      }
    } finally {
      setSaving(false)
    }
  }

  async function deleteNote() {
    if (!selected) return
    await fetch(`http://localhost:3000/api/notes/${selected.id}`, { method: "DELETE" })
    // Remove the note from local state and reset the editor
    setNotes(notes.filter((n) => n.id !== selected.id))
    setSelected(null)
    setMode(null)
    setDeleteConfirm(false)
    // On mobile, reopen the sidebar so the user can pick another note
    if (isMobile) setSidebarOpen(true)
  }

  // True whenever the main panel should show the editor (both edit and new modes)
  const isEditing = mode === "edit" || mode === "new"

  return (
    <div
      style={{
        fontFamily: "'DM Mono', 'Fira Mono', monospace",
        background: colors.bgBase,
        color: colors.textPrimary,
      }}
      className="flex h-screen overflow-hidden relative"
    >
      {/* ── Mobile overlay backdrop ── */}
      {/* Shown when the sidebar slides over the editor on mobile; clicking it closes the sidebar */}
      {isMobile && sidebarOpen && isEditing && (
        <div
          ref={overlayRef}
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 20,
            backdropFilter: "blur(2px)",
            transition: "opacity 0.25s ease",
          }}
        />
      )}

      {/* ── Sidebar ── */}
      {/* On desktop the sidebar collapses in-place (width → 0); on mobile it slides in as a fixed overlay panel */}
      <div
        style={{
          borderColor: colors.bgBorder,
          // Desktop: static sidebar, mobile: overlay sliding panel
          ...(isMobile
            ? {
                position: "fixed",
                top: 0,
                left: 0,
                height: "100%",
                zIndex: 30,
                transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,0.3)" : "none",
                width: "min(288px, 85vw)",
              }
            : {
                position: "relative",
                width: sidebarOpen ? "288px" : "0px",
                minWidth: sidebarOpen ? "288px" : "0px",
                overflow: "hidden",
                transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }),
          background: colors.bgBase,
        }}
        className="flex flex-col border-r"
      >
        <div style={{ width: isMobile ? "min(288px, 85vw)" : "288px" }} className="flex flex-col h-full overflow-hidden">
          {/* Sidebar header */}
          <div
            style={{ borderColor: colors.bgBorder }}
            className="h-16 flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
          >
            <div className="flex items-center gap-2.5">
              <div
                style={{ backgroundColor: colors.accent ?? '#7C6FCD' }}
                className="w-[3px] h-4 rounded-full opacity-70"
              />
              <span
                style={{ color: colors.textMuted }}
                className="text-sm tracking-[0.2em] uppercase font-medium whitespace-nowrap"
              >
                Notes
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={startNew}
                style={{ color: colors.textMuted }}
                className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:opacity-70"
                title="New note"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Note list */}
          <div className="flex-1 min-w-0 overflow-y-auto py-2 scrollbar-hide">
            {notes.length === 0 && (
              <p style={{ color: colors.textMuted }} className="text-sm px-5 py-4 whitespace-nowrap">
                No notes yet.
              </p>
            )}

            {notes.map((note) => {
              const isActive = selected?.id === note.id
              return (
                <button
                  key={note.id}
                  onClick={() => selectNote(note)}
                  style={{
                    background: isActive ? colors.bgSurface : "transparent",
                    // Accent left border highlights the currently selected note
                    borderLeftColor: isActive ? colors.accent : "transparent",
                  }}
                  className="w-full max-w-full text-left px-5 py-3 border-l-2 transition-colors overflow-hidden flex flex-col"
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = colors.bgHover
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"
                  }}
                >
                  <p
                    style={{ color: isActive ? colors.textPrimary : colors.textSecondary }}
                    className="text-base font-medium truncate mb-0.5 w-full"
                  >
                    {note.title || "Untitled"}
                  </p>
                  {/* Content preview — truncated to a single line */}
                  <p style={{ color: colors.textMuted }} className="text-sm truncate w-full">
                    {note.content}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Main Panel ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Empty state — shown when no note is open */}
        {!isEditing && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div
              style={{ background: colors.bgSurface }}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="14" height="14" rx="2" stroke={colors.bgBorder} strokeWidth="1.5" />
                <path d="M5 6h8M5 9h6M5 12h4" stroke={colors.textMuted} strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <p style={{ color: colors.textMuted }} className="text-sm tracking-widest uppercase">
              Select a note
            </p>
            {/* Mobile: show open sidebar hint if no notes visible */}
            {isMobile && !sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{ color: colors.accent }}
                className="text-sm mt-1 underline underline-offset-2 opacity-70"
              >
                Open notes list
              </button>
            )}
          </div>
        )}

        {/* ── Edit / New mode ── */}
        {isEditing && (
          <>
            {/* Toolbar: sidebar toggle on the left, save/delete actions on the right */}
            <div
              style={{ borderColor: colors.bgBorder }}
              className="h-16 flex items-center justify-between px-4 md:px-8 py-4 border-b flex-shrink-0 gap-2"
            >
              {/* Left: sidebar toggle + label */}
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  style={{
                    color: colors.textMuted,
                    borderColor: colors.bgBorder,
                  }}
                  className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md border transition-all hover:opacity-100 opacity-60"
                  title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                >
                  {isMobile ? (
                    // Back arrow on mobile
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M9 2.5L4.5 7 9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : sidebarOpen ? (
                    // Panel-collapse icon when open
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                      <line x1="4.5" y1="1.5" x2="4.5" y2="12.5" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M7.5 5l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    // Panel-expand icon when closed
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                      <line x1="4.5" y1="1.5" x2="4.5" y2="12.5" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M8.5 5l-2 2 2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                <span style={{ color: colors.textMuted }} className="text-sm tracking-widest uppercase whitespace-nowrap">
                  {mode === "new"
                    ? "New note"
                    : selected
                    ? `Note #${noteIndex(selected.id)}`
                    : ""}
                </span>
              </div>

              {/* Right: action buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {mode === "edit" && (
                  // First click shows the confirmation buttons; second click confirms deletion
                  !deleteConfirm ? (
                    <button
                      onClick={() => setDeleteConfirm(true)}
                      style={{ color: colors.textSecondary }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded-lg transition-colors hover:opacity-70"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M1.5 3h9M4.5 3V1.5h3V3M10 3l-.75 7.5H2.75L2 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={deleteNote}
                        style={{ background: colors.dangerBg, color: colors.danger }}
                        className="px-2.5 py-1.5 text-sm rounded-lg transition-colors hover:opacity-80 whitespace-nowrap"
                      >
                        Yes, delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(false)}
                        style={{ color: colors.textMuted }}
                        className="px-2.5 py-1.5 text-sm rounded-lg transition-colors hover:opacity-70"
                      >
                        Cancel
                      </button>
                    </div>
                  )
                )}

                {/* Save is disabled until the title field has at least one non-whitespace character */}
                <button
                  onClick={saveNote}
                  disabled={saving || !editTitle.trim()}
                  style={{ background: colors.accent, color: colors.bgBase }}
                  className="px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 whitespace-nowrap"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col px-4 md:px-8 py-6 md:py-8 gap-4 overflow-y-auto scrollbar-hide">
              <input
                autoFocus
                type="text"
                placeholder="Title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{
                  background: "transparent",
                  color: colors.textPrimary,
                  caretColor: colors.accent,
                }}
                className="text-xl md:text-2xl font-semibold outline-none border-none w-full opacity-100 placeholder:opacity-25"
              />
              {/* Divider between title and body */}
              <div style={{ background: colors.bgBorder }} className="h-px" />
              <textarea
                placeholder="Start writing…"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                style={{
                  background: "transparent",
                  color: colors.textSecondary,
                  caretColor: colors.accent,
                }}
                className="flex-1 text-base outline-none border-none resize-none leading-7 w-full min-h-[300px] placeholder:opacity-25 scrollbar-hide"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
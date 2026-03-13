export const colors = {
  // ── Backgrounds ───────────────────────────────
  bgBase:       "#0f0f0f",   // root / page background
  bgSurface:    "#1a1a1a",   // cards, active sidebar item, panels
  bgHover:      "#161616",   // subtle hover state
  bgBorder:     "#1e1e1e",   // dividers and borders

  // ── Text ──────────────────────────────────────
  textPrimary:  "#cfcfcf",   // headings, active labels
  textSecondary:"#bdbdbd",   // body copy, note content
  textMuted:    "#8d8d8d",   // timestamps, placeholders, empty state
  textFaint:    "#6b6b6b",   // input placeholders

  // ── Accent  ─────────────────────────────────── 
  accent:       "#9832f8",   // selected border, save button bg
  accentHover:  "#5215a1",   // save button hover

  // ── Danger ────────────────────────────────────
  danger:       "#f87171",   // delete text / confirm
  dangerBg:     "rgba(173, 47, 47, 0.31)", // delete button bg
  dangerBgHover:"rgba(248,113,113,0.18)",
} as const

export type Colors = typeof colors
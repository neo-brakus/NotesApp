export const colors = {
  // Backgrounds
  bgBase:       "#0f0f0f",
  bgSurface:    "#1a1a1a",
  bgHover:      "#161616",
  bgBorder:     "#1e1e1e",

  // Text
  textPrimary:  "#cfcfcf",
  textSecondary:"#bdbdbd",
  textMuted:    "#8d8d8d",
  textFaint:    "#6b6b6b",

  // Accent
  accent:       "#9832f8",
  accentHover:  "#5215a1",

  // Danger
  danger:       "#f87171",
  dangerBg:     "rgba(173, 47, 47, 0.31)",
  dangerBgHover:"rgba(248,113,113,0.18)",
} as const

export type Colors = typeof colors
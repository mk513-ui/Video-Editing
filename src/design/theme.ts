export const colors = {
  primary: "#0b84f3",
  secondary: "#6c5ce7",
  accent: "#e94560",
  background: "#1a1a2e",
  surface: "#16213e",
  text: "#ffffff",
  textMuted: "#a0aec0",
  success: "#00b894",
  warning: "#fdcb6e",
  error: "#d63031",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
  "4xl": 96,
};

export const safeArea = (width: number) => ({
  horizontal: Math.round((80 / 1080) * width),
  vertical: Math.round((100 / 1080) * width),
});

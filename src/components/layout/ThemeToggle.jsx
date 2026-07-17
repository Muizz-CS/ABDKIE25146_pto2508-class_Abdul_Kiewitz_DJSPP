import { useTheme } from "../../context/ThemeContext";

/**
 * Sun/moon button that flips between light and dark theme. The icon
 * reflects the *current* theme (sun while light, moon while dark) rather
 * than the theme you'd switch to. Takes no props — reads/writes theme
 * state via `useTheme`.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      className="og-theme-btn"
      onClick={toggleTheme}
      type="button"
      title={isDark ? "Chuyển sang nền sáng" : "Chuyển sang nền tối"}
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun size={16} className="og-theme-icon og-theme-icon--sun" />
      ) : (
        <Moon size={16} className="og-theme-icon og-theme-icon--moon" />
      )}
      <span className="og-theme-btn__text">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}

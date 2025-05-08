import { useThemeStore } from '../../store/themeStore';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <button
      className={`text-xs rounded px-2 py-1 border dark:border-zinc-600 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition ${className}`}
      onClick={toggleTheme}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
} 
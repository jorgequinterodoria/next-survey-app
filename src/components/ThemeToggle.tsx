'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md transition-all ${
          resolvedTheme === 'light' && theme !== 'system'
            ? 'bg-white dark:bg-slate-700 shadow-sm text-amber-500'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
        }`}
        title="Modo claro"
        aria-label="Cambiar a modo claro"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md transition-all ${
          resolvedTheme === 'dark' && theme !== 'system'
            ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-400'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
        }`}
        title="Modo oscuro"
        aria-label="Cambiar a modo oscuro"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-md transition-all ${
          theme === 'system'
            ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-500'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
        }`}
        title="Usar preferencia del sistema"
        aria-label="Usar preferencia del sistema"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}

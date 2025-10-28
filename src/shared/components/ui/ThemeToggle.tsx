import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={() => {
        console.log('Theme toggle clicked, isDark:', isDark);
        toggleTheme();
      }}
      type="button"
      className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun 
          size={20} 
          strokeWidth={2} 
          className="shrink-0 text-warning" 
          aria-hidden="true" 
        />
      ) : (
        <Moon 
          size={20} 
          strokeWidth={2} 
          className="shrink-0 text-foreground" 
          aria-hidden="true" 
        />
      )}
      <span className="sr-only">{isDark ? 'Currently in dark mode' : 'Currently in light mode'}</span>
    </button>
  );
};

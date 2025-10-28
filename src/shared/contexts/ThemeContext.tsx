import { createContext, useContext, useEffect, useState } from 'react';
import type { TTheme, TThemeContextType, TThemeProviderProps } from './interfaces';

const ThemeContext = createContext<TThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: TThemeProviderProps) => {
  const [theme, setTheme] = useState<TTheme>('light');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme') as TTheme | null;
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = (saved === 'light' || saved === 'dark') 
        ? saved 
        : systemDark ? 'dark' : 'light';

      setTheme(initialTheme);
      
      applyThemeToDom(initialTheme);
    } catch (error) {
      console.error('Error initializing theme:', error);
    }
  }, []);

  useEffect(() => {
    applyThemeToDom(theme);
    localStorage.setItem('theme', theme);
    console.log('Applied theme:', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

function applyThemeToDom(theme: TTheme) {
  try {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }
  } catch (error) {
    console.error('DOM error:', error);
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

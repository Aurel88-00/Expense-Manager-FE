import type { ReactNode } from 'react';

export type TTheme = 'light' | 'dark';

export interface TThemeContextType {
  theme: TTheme;
  toggleTheme: () => void;
  isDark: boolean;
}

export interface TThemeProviderProps {
  children: ReactNode;
}


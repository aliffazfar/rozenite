import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ThemeName, themes } from './themeConfig';

interface ThemeContextType {
  themeName: ThemeName;
  theme: typeof themes['rozenite']; 
  setTheme: (themeName: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    try {
      const storedTheme = localStorage.getItem('theme');
      return (storedTheme as ThemeName) || 'rozenite';
    } catch (error) {
      console.error('Failed to read theme from localStorage:', error);
      return 'rozenite';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('theme', themeName);
    } catch (error) {
      console.error('Failed to write theme to localStorage:', error);
    }
  }, [themeName]);

  const currentTheme = themes[themeName];

  return (
    <ThemeContext.Provider
      value={{ themeName, theme: currentTheme, setTheme: setThemeName }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
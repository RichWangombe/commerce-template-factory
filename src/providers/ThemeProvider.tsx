
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // First add a transition class to enable smooth transition
    root.classList.add("theme-transition");
    
    // Remove existing theme classes
    root.classList.remove("light", "dark");
    
    // Add the new theme class
    root.classList.add(theme);
    
    // Store the theme preference
    localStorage.setItem(storageKey, theme);
    
    // Optional: remove the transition class after the transition is complete
    // to prevent transitions when other classes change
    const transitionEndHandler = () => {
      root.classList.remove("theme-transition");
    };
    
    root.addEventListener("transitionend", transitionEndHandler);
    
    return () => {
      root.removeEventListener("transitionend", transitionEndHandler);
    };
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

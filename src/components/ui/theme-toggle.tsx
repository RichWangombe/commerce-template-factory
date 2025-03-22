
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/ThemeProvider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by only showing the theme toggle after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!isMounted) {
    return <div className="w-10 h-10" aria-hidden="true" />;
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="rounded-full focus-ring" 
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
    >
      <div className="relative w-6 h-6 overflow-hidden">
        <Sun 
          className={`h-[1.2rem] w-[1.2rem] absolute top-0 left-0 transition-transform duration-300 ${
            theme === "light" ? "scale-0 rotate-90" : "scale-100 rotate-0"
          }`} 
        />
        <Moon 
          className={`h-[1.2rem] w-[1.2rem] absolute top-0 left-0 transition-transform duration-300 ${
            theme === "light" ? "scale-100 rotate-0" : "scale-0 rotate-90"
          }`} 
        />
      </div>
      <span className="sr-only">
        {theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      </span>
    </Button>
  );
}

export default ThemeToggle;

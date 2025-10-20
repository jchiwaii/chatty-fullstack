import { useEffect, useState } from "react";
import { ThemeProviderContext } from "../contexts/ThemeContext";

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "chatty-theme",
  ...props
}) {
  const [theme, setTheme] = useState(() => {
    // Initialize theme immediately from localStorage or default
    const savedTheme = localStorage.getItem(storageKey);
    const initialTheme = savedTheme || defaultTheme;
    console.log("Initializing theme:", initialTheme);

    // Apply theme class immediately to prevent flash
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (initialTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(initialTheme);
    }

    return initialTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      console.log("Applying system theme:", systemTheme);
      root.classList.add(systemTheme);

      const handleChange = (e) => {
        root.classList.remove("light", "dark");
        root.classList.add(e.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      console.log("Applying theme:", theme);
      root.classList.add(theme);
    }
    console.log("HTML classes:", root.classList.toString());
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      console.log("Theme changing from", theme, "to", newTheme);
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

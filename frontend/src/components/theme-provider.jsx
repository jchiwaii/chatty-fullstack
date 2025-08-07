import { useEffect, useState } from "react";
import { ThemeProviderContext } from "../contexts/ThemeContext";

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "chatty-theme",
  ...props
}) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      console.log(
        "Initial theme from storage:",
        stored,
        "default:",
        defaultTheme
      );
      return stored || defaultTheme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;

    console.log("Applying theme:", theme);

    // Remove any existing theme classes from both html and body
    root.classList.remove("light", "dark");
    body.classList.remove("light", "dark");

    let appliedTheme = theme;

    if (theme === "system") {
      appliedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      console.log("Applied system theme:", appliedTheme);
    }

    // Apply theme to both html and body elements
    root.classList.add(appliedTheme);
    body.classList.add(appliedTheme);

    console.log("Applied theme class:", appliedTheme);
    console.log("HTML classes:", root.className);
    console.log("Body classes:", body.className);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      console.log("Setting theme to:", newTheme);
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

import { useEffect, useState } from "react"
import { ThemeProviderContext } from "../contexts/ThemeContext"

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "chatty-theme",
  ...props
}) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  )

  const [resolvedTheme, setResolvedTheme] = useState("light")

  useEffect(() => {
    const root = window.document.documentElement

    // Remove any existing theme classes
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      if (systemTheme === "dark") {
        root.classList.add("dark")
      }
      setResolvedTheme(systemTheme)
      return
    }

    if (theme === "dark") {
      root.classList.add("dark")
    }
    setResolvedTheme(theme)
  }, [theme])

  const value = {
    theme: resolvedTheme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

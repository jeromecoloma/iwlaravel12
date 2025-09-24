import React from "react"
import { Toaster as Sonner, ToasterProps } from "sonner"

interface CustomToasterProps extends ToasterProps {
  theme?: "light" | "dark" | "system"
}

const Toaster = ({ theme = "system", ...props }: CustomToasterProps) => {
  // Simple theme detection without next-themes
  const [currentTheme, setCurrentTheme] = React.useState<"light" | "dark">("light")

  React.useEffect(() => {
    if (theme === "system") {
      // Check system preference and dark mode class
      const isDark = document.documentElement.classList.contains("dark") ||
        (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
      setCurrentTheme(isDark ? "dark" : "light")

      // Listen for changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = (e: MediaQueryListEvent) => {
        if (!document.documentElement.classList.contains("dark") && !document.documentElement.classList.contains("light")) {
          setCurrentTheme(e.matches ? "dark" : "light")
        }
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    } else {
      setCurrentTheme(theme)
    }
  }, [theme])

  return (
    <Sonner
      theme={currentTheme}
      className="toaster group"
      richColors={true}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }

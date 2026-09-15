import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "pdf-copilot-theme";

function resolve(mode: ThemeMode): "light" | "dark" {
  if (mode !== "system") return mode;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored) setMode(stored);
  }, []);

  useEffect(() => {
    const applied = resolve(mode);
    document.documentElement.classList.toggle("dark", applied === "dark");
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((current) => (resolve(current) === "dark" ? "light" : "dark"));
  }, []);

  return { mode, setMode, toggle };
}

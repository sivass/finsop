/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
  const html = document.documentElement;

  if (html.classList.contains("dark")) {
    html.classList.remove("dark");
    html.classList.add("light");
    setIsDark(isDark => !isDark);
  } else {
    html.classList.remove("light");
    html.classList.add("dark");
    setIsDark(isDark => !isDark);
  }
};

  // Run ONLY on client
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);


  return (
    <button
      onClick={toggleTheme}
      className="h-10 w-10 rounded-lg border bg-slate-50 dark:bg-slate-800"
    >
      <span className="material-symbols-outlined">
        {isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}

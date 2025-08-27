"use client";

import { Language, PreferencesContext, Theme } from "@/lib/contexts/PreferenceContext";
import { ReactNode, useEffect, useState } from "react";

const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("light");

  const value = {
    language,
    theme,
    setLanguage,
    setTheme,
  };

  useEffect(() => {
    const locale = language;
    async function updateLocale() {
      await fetch("/api/preferences", {
        method: "POST",
        body: JSON.stringify({ locale }),
      });
    }
    updateLocale();
  }, [language]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export default PreferencesProvider;

"use client";

import { Language, PreferencesContext, Theme } from "@/lib/contexts/PreferenceContext";
import { ReactNode, useEffect, useState } from "react";

const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("light");
  const [isInitialized, setIsInitialized] = useState(false);
  const [initialLanguage, setInitialLanguage] = useState<Language>("en");

  const value = {
    language,
    theme,
    setLanguage,
    setTheme,
  };

  // Initialize language from cookie on mount
  useEffect(() => {
    async function initializeLanguage() {
      try {
        const response = await fetch("/api/preferences");
        const data = await response.json();
        if (data.locale) {
          setLanguage(data.locale as Language);
          setInitialLanguage(data.locale as Language);
        }
      } catch {
        // Fallback to default language
        setLanguage("en");
        setInitialLanguage("en");
      } finally {
        setIsInitialized(true);
      }
    }
    
    initializeLanguage();
  }, []);

  // Update cookie when language changes (but not on initial load)
  useEffect(() => {
    if (!isInitialized || language === initialLanguage) return;
    
    async function updateLocale() {
      try {
        await fetch("/api/preferences", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ locale: language }),
        });
        
        // Refresh the page to apply new locale
        window.location.reload();
      } catch (error) {
        console.error("Failed to update locale:", error);
      }
    }
    
    updateLocale();
  }, [language, isInitialized, initialLanguage]);

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

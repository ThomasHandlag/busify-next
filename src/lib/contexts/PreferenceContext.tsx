import { createContext, useContext } from "react";

interface PreferencesType {
  language: string;
  theme: "light" | "dark";
  setLanguage?: (lang: string) => void;
  setTheme?: (theme: "light" | "dark") => void;
}

export const PreferencesContext = createContext<PreferencesType | undefined>({
  language: "en",
  theme: "light",
});


export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};



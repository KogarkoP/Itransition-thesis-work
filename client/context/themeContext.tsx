import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

interface ThemeContextType {
  isDarkMode: boolean;
  setDarkMode: (value: boolean) => void;
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    const token = Cookies.get("@user_jwt");

    if (!token) {
      localStorage.clear();
      document.documentElement.setAttribute("data-bs-theme", "light");
      setDarkMode(false);
      i18n.changeLanguage("en");
      return;
    }

    setLoggedIn(true);
  }, []);

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, setDarkMode, isLoggedIn, setLoggedIn }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

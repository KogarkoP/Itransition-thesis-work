import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  PropsWithChildren,
} from "react";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

interface AppContextType {
  isDarkMode: boolean;
  setDarkMode: (value: boolean) => void;
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = PropsWithChildren;

export const AppProvider = ({ children }: AppProviderProps) => {
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
    <AppContext.Provider
      value={{ isDarkMode, setDarkMode, isLoggedIn, setLoggedIn }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

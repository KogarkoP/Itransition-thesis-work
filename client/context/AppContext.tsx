import {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { User } from "@/types/user";
import { getUserById } from "@/pages/api/userFetch";

interface AppContextType {
  isDarkMode: boolean;
  setDarkMode: (value: boolean) => void;
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  currentUser: User | null | undefined;
  fetchCurrentUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = PropsWithChildren;

export const AppProvider = ({ children }: AppProviderProps) => {
  const [isDarkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null | undefined>();
  const { i18n } = useTranslation();

  const fetchCurrentUser = async () => {
    try {
      const userId = localStorage.getItem("userId") || "";
      if (!userId) return;
      const response = await getUserById(userId);
      if (response) {
        setCurrentUser(response.data.user);
        console.log(response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const token = Cookies.get("@user_jwt");

    if (!token) {
      localStorage.clear();
      document.documentElement.setAttribute("data-bs-theme", "light");
      setDarkMode(false);
      i18n.changeLanguage("en");
      setCurrentUser(null);
      return;
    }

    if (token) {
      fetchCurrentUser();
    }
    setLoggedIn(true);
  }, []);

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        setDarkMode,
        isLoggedIn,
        setLoggedIn,
        currentUser,
        fetchCurrentUser,
      }}
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

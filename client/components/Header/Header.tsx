import styles from "./Header.module.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import Link from "next/link";
import Cookies from "js-cookie";
import UserMenu from "../UseMenu/UserMenu";
import { getUserById } from "@/pages/api/userFetch";
import { Option, Object } from "@/types/selectOption";
import { useApp } from "@/context/AppContext";
import NavSideBar from "../NavSideBar/NavSideBar";

type HeaderProps = {
  width: number;
  isNavSideBar: boolean;
  toggleNavSideBar: () => void;
};

const Header = ({ width, isNavSideBar, toggleNavSideBar }: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const { setDarkMode, isLoggedIn, setLoggedIn } = useApp();
  const [isMounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ [key: string]: string }>({});
  const [userMenu, setUserMenu] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option>({
    value: "en",
    label: "English",
  });
  const languages: Option[] = [
    { value: "en", label: t("english") },
    { value: "lt", label: t("lithuanian") },
    { value: "ru", label: t("russian") },
  ];

  const languagesKeys: Object = {
    en: "english",
    lt: "lithuanian",
    ru: "russian",
  };

  const [theme, setTheme] = useState<Option>({
    value: "light",
    label: t("light"),
  });

  const themeOptions: Option[] = [
    { value: "light", label: t("light") },
    { value: "dark", label: t("dark") },
  ];

  const themeKeys: Object = {
    light: "light",
    dark: "dark",
  };

  const toggleUserMenu = () => {
    setUserMenu((prev) => !prev);
  };

  useEffect(() => {
    const jwt = Cookies.get("@user_jwt");
    if (jwt) {
      setLoggedIn(true);
    }
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const response = await getUserById(userId);
      setUser(response.data.user);
    };

    fetchUser();

    const savedTheme = localStorage.getItem("userTheme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-bs-theme", savedTheme);
      const themeOption = {
        value: savedTheme,
        label: t(themeKeys[savedTheme]),
      };
      setTheme(themeOption);
      setDarkMode(savedTheme === "light" ? false : true);
    }

    const savedLanguage = localStorage.getItem("userLanguage") || null;
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      const languageOption = {
        value: savedLanguage,
        label: t(languagesKeys[savedLanguage]),
      };
      setSelectedOption(languageOption);
    }

    setMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className={styles.header_wrapper}>
      {width < 1024 && (
        <div className={styles.nav_bar_btn_wrapper}>
          <Button
            className={styles.nav_side_bar_btn}
            onClick={toggleNavSideBar}
          >
            <Icon.List />
          </Button>
        </div>
      )}
      {width < 1024 && isNavSideBar && (
        <NavSideBar width={width} toggleNavSideBar={toggleNavSideBar} />
      )}
      <div className={styles.search_wrapper}>
        <input
          type="text"
          id="inventories_search"
          name="inventories_search"
          placeholder={t("search")}
        />
      </div>
      <div className={styles.user_con}>
        {isLoggedIn ? (
          <Button className={styles.user_menu_btn} onClick={toggleUserMenu}>
            {t("hi")} {user.name}!!! <Icon.ThreeDotsVertical />
          </Button>
        ) : (
          <Link href="/login" passHref>
            <Button className={styles.login_btn}>
              {t("loginRegistration")}
              <Icon.BoxArrowInRight />
            </Button>
          </Link>
        )}
        {userMenu && (
          <UserMenu
            selectedOption={selectedOption}
            theme={theme}
            themeOptions={themeOptions}
            themeKeys={themeKeys}
            languages={languages}
            user={user}
            languagesKeys={languagesKeys}
            setSelectedOption={setSelectedOption}
            setTheme={setTheme}
            setUserMenu={setUserMenu}
            toggleUserMenu={toggleUserMenu}
          />
        )}
      </div>
    </div>
  );
};

export default Header;

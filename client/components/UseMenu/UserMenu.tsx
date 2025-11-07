import styles from "./UserMenu.module.css";
import Select, { SingleValue } from "react-select";
import { useTheme } from "@/context/themeContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { selectStyles } from "@/styles/selectStyle";
import { Option, Object } from "@/types/selectOption";
import { Button } from "react-bootstrap";
import { updateUserById } from "@/pages/api/userFetch";
import * as Icon from "react-bootstrap-icons";
import Cookies from "js-cookie";

type UserMenuProps = {
  selectedOption: Option;
  theme: Option;
  themeOptions: Option[];
  themeKeys: Object;
  languages: Option[];
  languagesKeys: Object;
  user: { [key: string]: string };
  setSelectedOption: (value: Option) => void;
  setTheme: React.Dispatch<React.SetStateAction<Option>>;
  setUserMenu: (value: boolean) => void;
  toggleUserMenu: () => void;
};

const UserMenu = ({
  themeOptions,
  languages,
  languagesKeys,
  selectedOption,
  theme,
  themeKeys,
  user,
  setTheme,
  setUserMenu,
  setSelectedOption,
  toggleUserMenu,
}: UserMenuProps) => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, setDarkMode, setLoggedIn } = useTheme();
  const router = useRouter();

  const onLogout = () => {
    Cookies.remove("@user_jwt");
    localStorage.clear();
    setLoggedIn(false);
    document.documentElement.setAttribute("data-bs-theme", "light");
    setUserMenu(false);
    setDarkMode(false);
    i18n.changeLanguage("en");
    router.replace("/");
  };

  const changeTheme = (option: SingleValue<Option>) => {
    if (!option) return;
    localStorage.setItem("userTheme", option.value);
    document.documentElement.setAttribute("data-bs-theme", option.value);
    const translatedThemeOption = {
      value: option.value,
      label: t(themeKeys[option.value]),
    };
    setTheme(translatedThemeOption);
    setDarkMode(option.value === "light" ? false : true);
    const currentUser = localStorage.getItem("userId") || "";
    updateUserById({
      userId: currentUser,
      userOption: "theme",
      userValue: option.value,
    });
  };

  const changeLanguage = (option: SingleValue<Option>) => {
    if (!option) return;
    localStorage.setItem("userLanguage", option.value);
    i18n.changeLanguage(option.value);
    const translatedOption = {
      value: option.value,
      label: t(languagesKeys[option.value]),
    };
    setSelectedOption(translatedOption);
    const currentUser = localStorage.getItem("userId") || "";

    updateUserById({
      userId: currentUser,
      userOption: "language",
      userValue: option.value,
    });
  };

  useEffect(() => {
    setTheme((prev) => ({
      ...prev,
      label: t(prev.value),
    }));
  }, [i18n.language, t]);

  return (
    <div onClick={toggleUserMenu} className={styles.user_menu_wrapper}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={styles.user_menu}
      >
        <div className={styles.close_btn}>
          <Icon.X onClick={toggleUserMenu} />
        </div>
        <div className={styles.user_data}>
          <p>
            <span className={styles.user_data_title}> {t("name")}:</span>
            {user.name}
          </p>
          <p>
            <span className={styles.user_data_title}>{t("email")}:</span>
            {user.email}
          </p>
          <p>
            <span className={styles.user_data_title}>{t("verified")}:</span>
            {user.isVerified ? t("yes") : t("no")}
          </p>
          <p>
            <span className={styles.user_data_title}>{t("role")}:</span>
            {t(`${user.role}`)}
          </p>
        </div>
        <div className={styles.theme_select_wrapper}>
          <label htmlFor="theme">{t("selectTheme")}</label>
          <Select<Option, false>
            inputId="theme"
            className={`${styles.theme_select} ${styles.select}`}
            value={theme}
            onChange={changeTheme}
            options={themeOptions}
            isClearable={false}
            isSearchable={false}
            styles={selectStyles(isDarkMode)}
          />
        </div>
        <div className={styles.language_select_wrapper}>
          <label htmlFor="language">{t("selectLanguage")}</label>
          <Select<Option, false>
            inputId="language"
            className={`${styles.language_select} ${styles.select}`}
            value={selectedOption}
            onChange={changeLanguage}
            options={languages}
            isClearable={false}
            isSearchable={false}
            styles={selectStyles(isDarkMode)}
          />
        </div>
        <Button className={styles.logout_btn} onClick={onLogout}>
          {t("logout")} <Icon.BoxArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default UserMenu;

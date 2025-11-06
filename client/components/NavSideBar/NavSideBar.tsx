import styles from "./NavSideBar.module.css";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/themeContext";
import * as Icon from "react-bootstrap-icons";
import { useState } from "react";
import ModalTemplate from "../ModalTemplate/ModalTemplate";

const NavSideBar = () => {
  const { isLoggedIn } = useTheme();
  const { t } = useTranslation();
  const [isError, setError] = useState(false);

  const displayError = () => {
    setError(true);
    setTimeout(() => setError(false), 3000);
  };

  return (
    <>
      {isError && (
        <ModalTemplate>
          <div className={styles.message}>
            <Icon.XCircle />
            <p>{t("adminError")}</p>
          </div>
        </ModalTemplate>
      )}
      <div className={styles.content_wrapper}>
        <div className={styles.logo_wrapper}>
          <Link className={styles.home_link} href="/">
            <Icon.Boxes />
            <span>{t("inventory")}</span>
          </Link>
        </div>
        <ul className={styles.nav_wrapper}>
          {isLoggedIn ? (
            <Link href="/users">
              <li>{t("users")}</li>
            </Link>
          ) : (
            <li className={styles.not_allowed} onClick={displayError}>
              {t("users")}
            </li>
          )}
          <Link href="/">
            <li>{t("inventories")}</li>
          </Link>
        </ul>
      </div>
    </>
  );
};

export default NavSideBar;

import styles from "./NavSideBar.module.css";
import { useTranslation } from "react-i18next";
import { useApp } from "@/context/AppContext";
import * as Icon from "react-bootstrap-icons";
import { useState } from "react";
import ModalTemplate from "../ModalTemplate/ModalTemplate";

type NavSideBarProps = {
  width: number;
  toggleNavSideBar: () => void;
};

const NavSideBar = ({ width, toggleNavSideBar }: NavSideBarProps) => {
  const { isLoggedIn } = useApp();
  const { t } = useTranslation();
  const [isError, setError] = useState(false);

  const displayError = () => {
    setError(true);
    setTimeout(() => setError(false), 3000);
  };

  return (
    <>
      <div
        onClick={() => toggleNavSideBar()}
        className={styles.nav_side_bar_wrapper}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={styles.content_wrapper}
        >
          {width < 1024 && (
            <div className={styles.close_btn}>
              <Icon.X onClick={() => toggleNavSideBar()} />
            </div>
          )}
          <div className={styles.logo_wrapper}>
            <a className={styles.home_link} href="/">
              <Icon.Boxes />
              <span>{t("inventory")}</span>
            </a>
          </div>
          <ul className={styles.nav_wrapper}>
            <a href="/users">
              <li>{t("users")}</li>
            </a>
            <a href="/">
              <li>{t("inventories")}</li>
            </a>
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavSideBar;

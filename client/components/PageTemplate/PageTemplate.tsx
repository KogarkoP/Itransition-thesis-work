import styles from "./PageTemplate.module.css";
import Header from "../Header/Header";
import NavSideBar from "../NavSideBar/NavSideBar";
import { useEffect, useState } from "react";

type PageTemplateProps = {
  children: React.ReactNode;
};

const PageTemplate = ({ children }: PageTemplateProps) => {
  const [width, setWidth] = useState<number>(0);
  const [isNavSideBar, setNavSideBar] = useState<boolean>(false);

  const toggleNavSideBar = () => {
    setNavSideBar((prev) => !prev);
  };

  useEffect(() => {
    const resizeWindow = () => {
      setWidth(window.innerWidth);
    };

    resizeWindow();

    window.addEventListener("resize", resizeWindow);

    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  useEffect(() => {
    if (width > 1024) {
      setNavSideBar(false);
    }
  }, [width]);

  return (
    <div className={styles.content_wrapper}>
      {width && width > 1024 && (
        <div className={styles.sidebar_wrapper}>
          <NavSideBar width={width} toggleNavSideBar={toggleNavSideBar} />
        </div>
      )}
      <div className={styles.wrapper}>
        <Header
          isNavSideBar={isNavSideBar}
          toggleNavSideBar={toggleNavSideBar}
          width={width}
        />
        {children}
      </div>
    </div>
  );
};

export default PageTemplate;

import styles from "./PageTemplate.module.css";
import Header from "../Header/Header";
import NavSideBar from "../NavSideBar/NavSideBar";

type PageTemplateProps = {
  children: React.ReactNode;
};

const PageTemplate = ({ children }: PageTemplateProps) => {
  return (
    <div className={styles.content_wrapper}>
      <div className={styles.sidebar_wrapper}>
        <NavSideBar />
      </div>
      <div className={styles.wrapper}>
        <Header />
        {children}
      </div>
    </div>
  );
};

export default PageTemplate;

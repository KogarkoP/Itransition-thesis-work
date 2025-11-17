import styles from "./NothingFound.module.css";
import * as Icon from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

const NothingFound = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.notification_wrapper}>
      <div className={styles.nothing_found_con}>
        <Icon.Search className={styles.search_icon} />
        <Icon.Question className={styles.question_icon} />
      </div>
      <p>{t("nothingFound")}</p>
    </div>
  );
};

export default NothingFound;

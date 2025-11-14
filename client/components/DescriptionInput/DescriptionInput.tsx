import styles from "./Descriptioninput.module.css";
import { useTranslation } from "react-i18next";

type DescriptionInputProps = {
  description: string;
  desFormStyles?: string;
  setDescription: (value: string) => void;
};

const DescriptionInput = ({
  description,
  desFormStyles,
  setDescription,
}: DescriptionInputProps) => {
  const { t } = useTranslation();
  return (
    <div className={styles.form_row}>
      <label htmlFor="description">{t("description")}</label>
      <textarea
        className={`${styles.description_input} ${
          desFormStyles ? styles[desFormStyles] : ""
        }`}
        id="description"
        placeholder={t("descriptionPlaceholder")}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  );
};

export default DescriptionInput;

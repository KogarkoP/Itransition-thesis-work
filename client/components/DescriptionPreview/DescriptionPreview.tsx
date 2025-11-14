import styles from "./DescriptionPreview.module.css";
import { marked } from "marked";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { useTranslation } from "react-i18next";

type DescriptionPreviewProps = {
  description: string;
  desFormStyles?: string | "";
};

const DescriptionPreview = ({
  description,
  desFormStyles,
}: DescriptionPreviewProps) => {
  const { t } = useTranslation();
  const rawHtml = marked(description || `_${t("nothingToPreview")}_`) as string;
  const cleanHtml = DOMPurify.sanitize(rawHtml);
  const descriptionPreview = parse(cleanHtml);

  return (
    <div className={styles.form_row}>
      <h4 className={styles.description_preview_heading}>{t("preview")}</h4>
      <div
        id="description_preview"
        className={`${styles.description_preview} ${
          desFormStyles ? styles[desFormStyles] : ""
        }`}
      >
        {descriptionPreview}
      </div>
    </div>
  );
};

export default DescriptionPreview;

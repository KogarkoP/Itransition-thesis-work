import styles from "./InventoryForm.module.css";
import { insertInventory } from "@/pages/api/inventoryFetch";
import { useState } from "react";
import ModalTemplate from "../ModalTemplate/ModalTemplate";
import { useTranslation } from "react-i18next";
import { Option } from "@/types/selectOption";
import Select, { SingleValue } from "react-select";
import { Button } from "react-bootstrap";
import { useTheme } from "@/context/themeContext";
import { selectStyles } from "@/styles/selectStyle";
import { marked } from "marked";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import * as Icon from "react-bootstrap-icons";

type InventoryFormProps = {
  isCreated: boolean;
  setCreated: (value: boolean) => void;
  toggleForm: () => void;
  fetchInventories: () => void;
};

const InventoryForm = ({
  isCreated,
  setCreated,
  toggleForm,
  fetchInventories,
}: InventoryFormProps) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<Option | null>(null);
  const [description, setDescription] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const rawHtml = marked(description || `_${t("nothingToPreview")}_`) as string;
  const cleanHtml = DOMPurify.sanitize(rawHtml);
  const descriptionPreview = parse(cleanHtml);

  const categories = [
    { value: "appliances", label: t("appliances") },
    { value: "clothing", label: t("clothing") },
    { value: "cleaning", label: t("cleaningSupplies") },
    { value: "electronics", label: t("electronics") },
    { value: "foodBeverage", label: t("foodBeverage") },
    { value: "furniture", label: t("furniture") },
    { value: "officeSupplies", label: t("officeSupplies") },
    { value: "others", label: t("others") },
    { value: "tools", label: t("tools") },
  ];

  const selectCategory = (option: SingleValue<Option>) => {
    if (!option) return;
    setCategory(option);
  };

  const onSubmit = async () => {
    try {
      const newErrors: { [key: string]: string } = {};

      if (!title.trim()) newErrors.title = t("titleField");
      if (!category) newErrors.category = t("selectCategory");

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const createdBy = localStorage.getItem("userId");
      if (!createdBy) return;

      const inventory = {
        title: title,
        category: category!.value,
        createdBy: createdBy,
        description: (description || "").trim(),
      };

      const response = await insertInventory(inventory);
      if (response.status === 201) {
        setCreated(true);
        setTimeout(() => setCreated(false), 3000);
      }

      setTitle("");
      setCategory(null);
      setDescription("");
      fetchInventories();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ModalTemplate>
      <div className={styles.form_wrapper}>
        <div className={styles.close_btn}>
          <Icon.X onClick={() => toggleForm()} />
        </div>
        <div className={styles.form_row}>
          <label htmlFor="title">
            {t("title")}
            <span className={styles.required} title={t("required")}>
              *
            </span>
          </label>
          <input
            className={styles.title_input}
            id="title"
            type="text"
            placeholder={t("title")}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prev) => {
                const { title, ...res } = prev;
                return res;
              });
            }}
          />
          {errors.title && <p className={styles.field_error}>{errors.title}</p>}
        </div>
        <div className={styles.form_row}>
          <label htmlFor="category">
            {t("category")}
            <span className={styles.required} title={t("required")}>
              *
            </span>
          </label>
          <Select
            inputId="category"
            className={`${styles.category_select} ${styles.select}`}
            placeholder={t("select")}
            value={category}
            onChange={(e) => {
              selectCategory(e);
              setErrors((prev) => {
                const { category, ...res } = prev;
                return res;
              });
            }}
            options={categories}
            isClearable={false}
            isSearchable={false}
            styles={selectStyles(isDarkMode)}
          />
          {errors.category && (
            <p className={styles.field_error}>{errors.category}</p>
          )}
        </div>
        <div className={styles.form_row}>
          <label htmlFor="description">{t("description")}</label>
          <textarea
            className={styles.description_input}
            id="description"
            placeholder={t("descriptionPlaceholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={styles.form_row}>
          <h4 className={styles.description_preview_heading}>{t("preview")}</h4>
          <div id="description_preview" className={styles.description_preview}>
            {descriptionPreview}
          </div>
        </div>
        <Button className={styles.add_btn} onClick={onSubmit}>
          {t("add")}
        </Button>
        {isCreated && (
          <p className={styles.success}>
            {t("success")}
            <Icon.CheckCircle />
          </p>
        )}
      </div>
    </ModalTemplate>
  );
};

export default InventoryForm;

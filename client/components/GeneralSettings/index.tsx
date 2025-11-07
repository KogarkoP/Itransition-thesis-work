import { useEffect, useState } from "react";
import styles from "./GeneralSettings.module.css";
import { Inventory } from "@/types/inventory";
import { useTranslation } from "react-i18next";
import { selectStyles } from "@/styles/selectStyle";
import Select, { SingleValue } from "react-select";
import { marked } from "marked";
import { Option } from "@/types/selectOption";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import * as Icon from "react-bootstrap-icons";
import { Button } from "react-bootstrap";
import { useTheme } from "@/context/themeContext";
import { updateInventorySettingsByID } from "@/pages/api/inventoryFetch";

type GeneralSettingsProps = {
  inventory: Inventory;
  isCreated: boolean;
  setCreated: (value: boolean) => void;
  fetchInventory: (value: string) => void;
};

const GeneralSettings = ({
  inventory,
  isCreated,
  setCreated,
  fetchInventory,
}: GeneralSettingsProps) => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, isLoggedIn } = useTheme();
  const [title, setTitle] = useState(inventory.title);
  const [description, setDescription] = useState(inventory.description);
  const [category, setCategory] = useState<Option | null>();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const rawHtml = marked(description || `_${t("nothingToPreview")}_`) as string;
  const cleanHtml = DOMPurify.sanitize(rawHtml);
  const descriptionPreview = parse(cleanHtml);

  const categories = [
    { value: "appliances", label: t("appliances") },
    { value: "clothing", label: t("clothing") },
    { value: "cleaning", label: t("cleaning") },
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

      const inventoryUpdate = {
        title: title,
        description: (description || "").trim(),
        category: category!.value,
      };

      const response = await updateInventorySettingsByID(
        inventory.id,
        inventoryUpdate
      );

      const data = response.data.inventory;

      if (response.status === 200) {
        setCreated(true);
        setTimeout(() => setCreated(false), 3000);
        fetchInventory(inventory.id);
        setTitle(data.title);
        setCategory(categories.find((c) => c.value === data.category));
        setDescription(data.description);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!inventory) {
      return;
    }

    const matchedCategory = categories.find(
      (c) => c.value === inventory.category
    );
    setCategory(matchedCategory);
  }, []);

  useEffect(() => {
    setCategory((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        label: t(prev.value),
      };
    });
  }, [i18n.language, t]);

  return (
    <div className={styles.main}>
      <div className={styles.settings_wrapper}>
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
      </div>
      <div className={styles.description_preview_wrapper}>
        <div className={styles.form_row}>
          <h4 className={styles.description_preview_heading}>{t("preview")}</h4>
          <div id="description_preview" className={styles.description_preview}>
            {descriptionPreview}
          </div>
        </div>
        <Button
          disabled={!isLoggedIn}
          className={styles.add_btn}
          onClick={onSubmit}
        >
          {t("save")}
        </Button>
        {isCreated && (
          <p className={styles.success}>
            {t("changesSaved")}
            <Icon.CheckCircle />
          </p>
        )}
      </div>
    </div>
  );
};

export default GeneralSettings;

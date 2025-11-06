import styles from "./ItemForm.module.css";
import { useState } from "react";
import ModalTemplate from "../ModalTemplate/ModalTemplate";
import { useTranslation } from "react-i18next";
import { Button } from "react-bootstrap";
import { marked } from "marked";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import * as Icon from "react-bootstrap-icons";
import { insertItem } from "@/pages/api/itemsFetch";
import { updateInventoryById } from "@/pages/api/inventoryFetch";
import { Inventory } from "@/types/inventory";

type ItemFormProps = {
  inventoryId: string;
  isCreated: boolean;
  inventoryItems: string[];
  setInventory: (value: Inventory) => void;
  setCreated: (value: boolean) => void;
  toggleForm: () => void;
  fetchItems: (value: string[]) => void;
};

const InventoryForm = ({
  inventoryId,
  isCreated,
  inventoryItems,
  setInventory,
  setCreated,
  toggleForm,
  fetchItems,
}: ItemFormProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const rawHtml = marked(description || `_${t("nothingToPreview")}_`) as string;
  const cleanHtml = DOMPurify.sanitize(rawHtml);
  const descriptionPreview = parse(cleanHtml);

  const onSubmit = async () => {
    try {
      const newErrors: { [key: string]: string } = {};

      if (!title.trim()) newErrors.title = t("titleField");
      if (!price) {
        newErrors.price = t("priceField");
      }

      const numericPrice = Number(price.replace(",", "."));
      if (isNaN(numericPrice)) {
        newErrors.price = t("priceMustBeNumber");
      }
      if (numericPrice <= 0) {
        newErrors.price = t("priceGreaterThanZero");
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const createdBy = localStorage.getItem("userId");
      if (!createdBy) return;

      const item = {
        title: title,
        price: Number(price.replace(",", ".")),
        createdBy: createdBy,
        description: (description || "").trim(),
      };

      const response = await insertItem(item);

      if (response.status === 201) {
        setCreated(true);
        setTimeout(() => setCreated(false), 3000);
      }

      const itemsIds = [];
      itemsIds.push(response.data.item.id);

      const userOption = "push";

      const inventoryResponse = await updateInventoryById(
        inventoryId,
        itemsIds,
        userOption
      );

      setInventory(inventoryResponse.data.inventory);

      setTitle("");
      setPrice("");
      setDescription("");
      fetchItems(inventoryItems);
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
          <label htmlFor="price">
            {t("price")}, &euro;
            <span className={styles.required} title={t("required")}>
              *
            </span>
          </label>
          <input
            className={styles.price_input}
            id="price"
            type="text"
            placeholder={t("price")}
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setErrors((prev) => {
                const { price, ...res } = prev;
                return res;
              });
            }}
          />
          {errors.price && <p className={styles.field_error}>{errors.price}</p>}
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

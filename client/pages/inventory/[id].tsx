import styles from "./inventory.module.css";
import { useRouter } from "next/router";
import { useState, useEffect, ReactNode } from "react";
import { getInventoryById, updateInventoryById } from "../api/inventoryFetch";
import { Inventory } from "@/types/inventory";
import PageTemplate from "@/components/PageTemplate/PageTemplate";
import { marked } from "marked";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { useTranslation } from "react-i18next";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Table } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import ItemRow from "@/components/ItemRow/ItemRow";
import { useApp } from "@/context/AppContext";
import { SingleValue } from "react-select";
import { Option } from "@/types/selectOption";
import { deleteItemsByIds, getAllItems } from "../api/itemsFetch";
import { Item } from "@/types/item";
import ItemForm from "@/components/ItemForm/ItemForm";
import GeneralSettings from "@/components/GeneralSettings/GeneralSettings";
import { Alert } from "@mui/material";
import Toolbar from "@/components/Toolbar/Toolbar";

const InventoryPage = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, isLoggedIn } = useApp();
  const router = useRouter();
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [isCreated, setCreated] = useState<boolean>(false);
  const [items, setItems] = useState<Item[] | []>([]);
  const [itemsIds, setItemsIds] = useState<string[]>([]);
  const [description, setDescription] = useState<ReactNode>(null);
  const [itemForm, setItemForm] = useState<boolean>(false);
  const [filter, setFilter] = useState<Option>({
    value: "all",
    label: t("all"),
  });
  const filterOptions: Option[] = [
    { value: "all", label: t("all") },
    { value: "cheapest", label: t("cheapest") },
    { value: "mostExpensive", label: t("mostExpensive") },
    { value: "newest", label: t("newestByCreation") },
    { value: "oldest", label: t("oldestByCreation") },
  ];

  const filteredItems = [...items].sort((a, b) => {
    if (filter.value === "cheapest") return a.price - b.price;
    if (filter.value === "mostExpensive") return b.price - a.price;
    if (filter.value === "newest")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (filter.value === "oldest")
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return 0;
  });

  const toggleItemForm = () => {
    setItemForm((prev) => !prev);
  };

  const changeFilter = (option: SingleValue<Option>) => {
    if (!option) return;
    setFilter(option);
  };

  const toggleCheckboxes = () => {
    if (!items) return;

    setItemsIds((prevIds) => {
      const allIds = filteredItems.map((item) => item.id);
      const allSelected = allIds.every((id) => prevIds.includes(id));
      return allSelected ? [] : allIds;
    });
  };

  const selectedItemsIds = (itemId: string) => {
    setItemsIds((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const fetchItems = async (itemsIds: string[]) => {
    try {
      const response = await getAllItems(itemsIds);
      setItems(response.data.items);
    } catch (err) {
      console.error("Error fetching items:", err);
      setItems([]);
    }
  };

  const fetchInventory = async (id: string) => {
    const response = await getInventoryById(id);
    setInventory(response.data.inventory);
  };

  const deleteItems = async (ids: string[]) => {
    try {
      await deleteItemsByIds(ids);

      const userOption = "pull";

      const updatedInventory = await updateInventoryById(
        router.query.id as string,
        ids,
        userOption
      );

      if (updatedInventory) {
        setInventory(updatedInventory.data.inventory);
        fetchItems(updatedInventory.data.items);
      }
    } catch (error) {
      console.log("Error deleting inventories:", error);
    } finally {
      setItemsIds([]);
    }
  };

  useEffect(() => {
    if (!inventory) {
      return;
    }
    fetchItems(inventory.items);
  }, [inventory]);

  useEffect(() => {
    if (router.query.id) {
      fetchInventory(router.query.id as string);
    }
  }, [router.query.id]);

  useEffect(() => {
    if (!inventory) return;
    if (typeof window === "undefined") return;

    const rawHtml = marked(inventory.description || "") as string;
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    setDescription(parse(cleanHtml));
  }, [inventory]);

  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      label: t(prev.value),
    }));
  }, [i18n.language, t]);

  return (
    <PageTemplate>
      <div className={`${styles.main} ${isDarkMode ? styles.dark : ""}`}>
        <h1>{inventory ? inventory.title : "Unknown"}</h1>
        {inventory && inventory.description && (
          <div className={styles.description_wrapper}>{description}</div>
        )}
        <Tabs>
          <TabList>
            <Tab>{t("items")}</Tab>
            <Tab>{t("chat")}</Tab>
            <Tab>{t("generalSettings")}</Tab>
          </TabList>

          <TabPanel className={styles.items_table}>
            {itemForm && inventory && (
              <ItemForm
                inventoryId={inventory.id}
                isCreated={isCreated}
                inventoryItems={inventory.items}
                setCreated={setCreated}
                toggleForm={toggleItemForm}
                setInventory={setInventory}
                fetchItems={fetchItems}
              />
            )}
            <h2>{t("items")}</h2>
            <Toolbar
              ids={itemsIds}
              filter={filter}
              filterOptions={filterOptions}
              changeFilter={changeFilter}
              deleteSomething={deleteItems}
              toggleForm={toggleItemForm}
            />
            {filteredItems && filteredItems.length > 0 ? (
              <Table responsive className={styles.inventories_table}>
                <thead>
                  <tr className={styles.table_heading}>
                    <th className={styles.checkbox_con}>
                      <input
                        type="checkbox"
                        disabled={!isLoggedIn}
                        id="select_all"
                        checked={
                          filteredItems.length > 0 &&
                          filteredItems.every((i) => itemsIds.includes(i.id))
                        }
                        onChange={toggleCheckboxes}
                      />
                    </th>
                    <th>{t("id")}</th>
                    <th>{t("title")}</th>
                    <th>{t("price")}, &euro;</th>
                    <th>{t("createdAt")}</th>
                    <th>{t("lastUpdate")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => {
                    return (
                      <ItemRow
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        price={item.price}
                        createdAt={item.createdAt}
                        updatedAt={item.updatedAt}
                        itemsIds={itemsIds}
                        setItemsIds={selectedItemsIds}
                      />
                    );
                  })}
                </tbody>
              </Table>
            ) : (
              <div className={styles.notification_wrapper}>
                <div className={styles.nothing_found_con}>
                  <Icon.Search className={styles.search_icon} />
                  <Icon.Question className={styles.question_icon} />
                </div>
                <p>{t("nothingFound")}</p>
              </div>
            )}
          </TabPanel>
          <TabPanel>
            <h2>Any content 2</h2>
          </TabPanel>
          <TabPanel>
            {!isLoggedIn ? (
              <Alert severity="error">{t("loginRequired")}</Alert>
            ) : (
              inventory && (
                <GeneralSettings
                  inventory={inventory}
                  isCreated={isCreated}
                  setCreated={setCreated}
                  fetchInventory={fetchInventory}
                />
              )
            )}
          </TabPanel>
        </Tabs>
      </div>
    </PageTemplate>
  );
};

export default InventoryPage;

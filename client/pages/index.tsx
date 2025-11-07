import styles from "@/styles/Home.module.css";
import PageTemplate from "@/components/PageTemplate/PageTemplate";
import { getAllInventories } from "./api/inventoryFetch";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import InventoryRow from "@/components/InventoryRow/InventoryRow";
import * as Icon from "react-bootstrap-icons";
import Select, { SingleValue } from "react-select";
import { selectStyles } from "@/styles/selectStyle";
import InventoryForm from "@/components/InventoryForm/InventoryForm";
import { useTheme } from "@/context/themeContext";
import { Inventory } from "@/types/inventory";
import { deleteInventoriesByIds } from "./api/inventoryFetch";
import { Option } from "@/types/selectOption";

const MainPage = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, isLoggedIn } = useTheme();
  const [inventories, setInventories] = useState<Inventory[] | []>([]);
  const [inventoryForm, setInventoryForm] = useState(false);
  const [isCreated, setCreated] = useState<boolean>(false);
  const [inventoriesIds, setInventoriesIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<Option>({
    value: "all",
    label: t("all"),
  });
  const filterOptions: Option[] = [
    { value: "all", label: t("all") },
    { value: "newest", label: t("newestByCreation") },
    { value: "oldest", label: t("oldestByCreation") },
  ];

  const changeFilter = (option: SingleValue<Option>) => {
    if (!option) return;
    setFilter(option);
  };

  const filteredInventories = [...inventories].sort((a, b) => {
    if (filter.value === "newest")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (filter.value === "oldest")
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return 0;
  });

  const toggleCheckboxes = () => {
    if (!inventories) return;

    setInventoriesIds((prevIds) => {
      const allIds = filteredInventories.map((inventory) => inventory.id);
      const allSelected = allIds.every((id) => prevIds.includes(id));
      return allSelected ? [] : allIds;
    });
  };

  const selectedInventoriesIds = (inventoryId: string) => {
    setInventoriesIds((prev) => {
      if (prev.includes(inventoryId)) {
        return prev.filter((id) => id !== inventoryId);
      } else {
        return [...prev, inventoryId];
      }
    });
  };

  const toggleInventoryForm = () => {
    setInventoryForm((prev) => !prev);
  };

  const fetchInventories = async () => {
    const response = await getAllInventories();
    setInventories(response.data.inventories);
  };

  const deleteInventories = async (ids: string[]) => {
    try {
      const response = await deleteInventoriesByIds(ids);

      fetchInventories();
    } catch (error) {
      console.log("Error deleting inventories:", error);
    } finally {
      setInventoriesIds([]);
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      label: t(prev.value),
    }));
  }, [i18n.language, t]);

  return (
    <PageTemplate>
      <div className={styles.main}>
        {inventoryForm && (
          <InventoryForm
            isCreated={isCreated}
            setCreated={setCreated}
            toggleForm={toggleInventoryForm}
            fetchInventories={fetchInventories}
          />
        )}
        <h1>{t("inventories")}</h1>
        <div className={styles.toolbar}>
          <ul className={styles.buttons_wrapper}>
            <li>
              <Button
                disabled={!isLoggedIn}
                className={styles.insert_btn}
                onClick={toggleInventoryForm}
              >
                {t("add")}
              </Button>
            </li>
            <li>
              <Button
                className="btn btn-danger"
                disabled={!isLoggedIn || inventoriesIds.length <= 0}
                onClick={() => deleteInventories(inventoriesIds)}
              >
                <Icon.Trash3Fill />
              </Button>
            </li>
          </ul>
          <ul className={styles.filter_wrapper}>
            <li>
              <Select
                className={styles.inventory_filter}
                inputId="inventory_filter"
                instanceId="inventory_filter"
                value={filter}
                onChange={changeFilter}
                options={filterOptions}
                styles={selectStyles(isDarkMode)}
              />
            </li>
          </ul>
        </div>
        {filteredInventories && filteredInventories.length > 0 ? (
          <Table responsive className={styles.inventories_table}>
            <thead>
              <tr className={styles.table_heading}>
                <th className={styles.checkbox_con}>
                  <input
                    type="checkbox"
                    id="select_all"
                    checked={
                      filteredInventories.length > 0 &&
                      filteredInventories.every((i) =>
                        inventoriesIds.includes(i.id)
                      )
                    }
                    onChange={toggleCheckboxes}
                  />
                </th>
                <th>{t("id")}</th>
                <th>{t("title")}</th>
                <th>{t("category")}</th>
                <th>{t("createdAt")}</th>
                <th>{t("lastUpdate")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventories.map((inventory) => {
                return (
                  <InventoryRow
                    key={inventory.id}
                    id={inventory.id}
                    title={inventory.title}
                    category={inventory.category}
                    createdAt={inventory.createdAt}
                    updatedAt={inventory.updatedAt}
                    inventoriesIds={inventoriesIds}
                    setInventoriesIds={selectedInventoriesIds}
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
      </div>
    </PageTemplate>
  );
};

export default MainPage;

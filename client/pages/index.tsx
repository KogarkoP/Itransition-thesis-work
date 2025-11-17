import styles from "@/styles/Home.module.css";
import PageTemplate from "@/components/PageTemplate/PageTemplate";
import { getAllInventories } from "./api/inventoryFetch";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { SingleValue } from "react-select";
import InventoryForm from "@/components/InventoryForm/InventoryForm";
import { Inventory } from "@/types/inventory";
import { deleteInventoriesByIds } from "./api/inventoryFetch";
import { Option } from "@/types/selectOption";
import Toolbar from "@/components/Toolbar/Toolbar";
import InventoriesTable from "@/components/InventoriesTable/InventoriesTable";

const MainPage = () => {
  const { t, i18n } = useTranslation();
  const [inventories, setInventories] = useState<Inventory[] | []>([]);
  const [inventoryForm, setInventoryForm] = useState<boolean>(false);
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
        <Toolbar
          ids={inventoriesIds}
          filter={filter}
          filterOptions={filterOptions}
          changeFilter={changeFilter}
          deleteSomething={deleteInventories}
          toggleForm={toggleInventoryForm}
        />
        <InventoriesTable
          inventoriesIds={inventoriesIds}
          filteredInventories={filteredInventories}
          toggleCheckboxes={toggleCheckboxes}
          setInventoriesIds={selectedInventoriesIds}
        />
      </div>
    </PageTemplate>
  );
};

export default MainPage;

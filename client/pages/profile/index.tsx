import styles from "./profile.module.css";
import PageTemplate from "@/components/PageTemplate/PageTemplate";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useTranslation } from "react-i18next";
import { useApp } from "@/context/AppContext";
import Toolbar from "@/components/Toolbar/Toolbar";
import { Option } from "@/types/selectOption";
import { SingleValue } from "react-select";
import { Inventory } from "@/types/inventory";
import InventoryForm from "@/components/InventoryForm/InventoryForm";
import {
  deleteInventoriesByIds,
  getUserInventories,
} from "../api/inventoryFetch";
import InventoriesTable from "@/components/InventoriesTable/InventoriesTable";
import { Button } from "react-bootstrap";
import SalesforceSyncForm from "@/components/SalesforceForm/SalesforceForm";

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, currentUser } = useApp();
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [inventories, setInventories] = useState<Inventory[] | []>([]);
  const [inventoriesIds, setInventoriesIds] = useState<string[]>([]);
  const [inventoryForm, setInventoryForm] = useState<boolean>(false);
  const [isCreated, setCreated] = useState<boolean>(false);
  const [isShowForm, setShowForm] = useState<boolean>(false);
  const [filter, setFilter] = useState<Option>({
    value: "all",
    label: t("all"),
  });
  const filterOptions: Option[] = [
    { value: "all", label: t("all") },
    { value: "newest", label: t("newestByCreation") },
    { value: "oldest", label: t("oldestByCreation") },
  ];

  const filteredInventories = [...inventories].sort((a, b) => {
    if (filter.value === "newest")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (filter.value === "oldest")
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return 0;
  });

  const toggleSalesforceForm = () => {
    setShowForm((prev) => {
      return !prev;
    });
  };

  const toggleCheckboxes = () => {
    setInventoriesIds((prevIds) => {
      const allIds = filteredInventories.map((inventory) => inventory.id);
      const allSelected = allIds.every((id) => prevIds.includes(id));
      return allSelected ? [] : allIds;
    });
  };

  const changeFilter = (option: SingleValue<Option>) => {
    if (!option) return;
    setFilter(option);
  };

  const toggleInventoryForm = () => {
    setInventoryForm((prev) => !prev);
  };

  const fetchInventories = async () => {
    if (!currentUser) return;
    const response = await getUserInventories(currentUser.id);
    setInventories(response.data.inventories);
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
    const token = Cookies.get("@user_jwt");
    if (!token) {
      router.push("login");
      return;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchInventories();
  }, [currentUser]);

  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      label: t(prev.value),
    }));
  }, [i18n.language, t]);

  if (isLoading) return null;

  return (
    <PageTemplate>
      {isShowForm && (
        <SalesforceSyncForm toggleSalesforceForm={toggleSalesforceForm} />
      )}
      <div className={`${styles.main} ${isDarkMode ? styles.dark : ""}`}>
        <div className={styles.bttn_wrapper}>
          <Button
            disabled={currentUser?.saleforceSync}
            className={styles.salesforce_btn}
            onClick={toggleSalesforceForm}
          >
            {t("syncToSalesforce")}
          </Button>
        </div>

        <h1>{t("profile")}</h1>
        <Tabs>
          <TabList>
            <Tab>{t("myInventories")}</Tab>
            <Tab>{t("writableInventories")}</Tab>
          </TabList>
          <TabPanel>
            <h2>{t("myInventories")}</h2>
            {inventoryForm && (
              <InventoryForm
                isCreated={isCreated}
                setCreated={setCreated}
                toggleForm={toggleInventoryForm}
                fetchInventories={fetchInventories}
              />
            )}
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
          </TabPanel>
          <TabPanel>
            <h2>{t("writableInventories")}</h2>
            <Toolbar
              filter={filter}
              filterOptions={filterOptions}
              changeFilter={changeFilter}
            />
          </TabPanel>
        </Tabs>
      </div>
    </PageTemplate>
  );
};

export default ProfilePage;

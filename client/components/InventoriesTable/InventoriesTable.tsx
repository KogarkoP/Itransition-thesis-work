import InventoryRow from "../InventoryRow/InventoryRow";
import { Inventory } from "@/types/inventory";
import TableHead from "../TableHead/TableHead";
import styles from "./InventoriesTable.module.css";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import NothingFound from "../NothingFound/NothingFound";

type InventoriesTableProps = {
  inventoriesIds: string[];
  filteredInventories: Inventory[];
  toggleCheckboxes: () => void;
  setInventoriesIds: (value: string) => void;
};

const UserInventories = ({
  inventoriesIds,
  filteredInventories,
  toggleCheckboxes,
  setInventoriesIds,
}: InventoriesTableProps) => {
  const { t } = useTranslation();
  const hasData = filteredInventories && filteredInventories.length > 0;

  return (
    <>
      {hasData ? (
        <Table responsive className={styles.inventories_table}>
          <TableHead
            ids={inventoriesIds}
            firstColumn={t("id")}
            secondColumn={t("title")}
            thirdColumn={t("category")}
            fourthColumn={t("createdAt")}
            fifthColumn={t("lastUpdate")}
            filteredData={filteredInventories}
            toggleCheckboxes={toggleCheckboxes}
          />

          <tbody>
            {filteredInventories.map((inventory) => (
              <InventoryRow
                key={inventory.id}
                id={inventory.id}
                title={inventory.title}
                category={inventory.category}
                createdAt={inventory.createdAt}
                updatedAt={inventory.updatedAt}
                inventoriesIds={inventoriesIds}
                setInventoriesIds={setInventoriesIds}
              />
            ))}
          </tbody>
        </Table>
      ) : (
        <NothingFound />
      )}
    </>
  );
};

export default UserInventories;

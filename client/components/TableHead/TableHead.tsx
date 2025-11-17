import { useApp } from "@/context/AppContext";
import styles from "./TableHead.module.css";

type DataItem = { id: string };

type TableHeadProps = {
  ids: string[];
  firstColumn: string | number;
  secondColumn: string | number;
  thirdColumn: string | number;
  fourthColumn: string | number;
  fifthColumn: string | number;
  filteredData: DataItem[];
  toggleCheckboxes: () => void;
};

const TableHead = ({
  ids,
  firstColumn,
  secondColumn,
  thirdColumn,
  fourthColumn,
  fifthColumn,
  filteredData,
  toggleCheckboxes,
}: TableHeadProps) => {
  const { isLoggedIn } = useApp();
  return (
    <thead>
      <tr className={styles.table_heading}>
        <th className={styles.checkbox_con}>
          <input
            type="checkbox"
            id="select_all"
            disabled={!isLoggedIn}
            checked={
              filteredData.length > 0 &&
              filteredData.every((i) => ids.includes(i.id))
            }
            onChange={toggleCheckboxes}
          />
        </th>
        <th>{firstColumn}</th>
        <th>{secondColumn}</th>
        <th>{thirdColumn}</th>
        <th>{fourthColumn}</th>
        <th>{fifthColumn}</th>
      </tr>
    </thead>
  );
};

export default TableHead;

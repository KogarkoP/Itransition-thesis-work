import styles from "./InventoryRow.module.css";
import Link from "next/link";

type InventoryRowProps = {
  id: string;
  title: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  inventoriesIds: string[];
  setInventoriesIds: (id: string) => void;
};

const InventoryRow = ({
  id,
  title,
  category,
  createdAt,
  updatedAt,
  inventoriesIds,
  setInventoriesIds,
}: InventoryRowProps) => {
  const creationTime = new Date(createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour12: false,
  });

  const updateTime = new Date(updatedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour12: false,
  });

  return (
    <tr className={`${styles.data_row}`}>
      <td className={styles.checkbox_con}>
        <input
          type="checkbox"
          id={id}
          checked={inventoriesIds.includes(id)}
          onChange={() => setInventoriesIds(id)}
        />
      </td>
      <td>
        <Link className={styles.id_link} href={`/inventory/${id}`}>
          {id}
        </Link>
      </td>
      <td>
        <Link className={styles.title_link} href={`/inventory/${id}`}>
          {title}
        </Link>
      </td>
      <td>{category}</td>
      <td>{creationTime}</td>
      <td>{updateTime}</td>
    </tr>
  );
};

export default InventoryRow;

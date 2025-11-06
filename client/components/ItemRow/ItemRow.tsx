import styles from "./ItemRow.module.css";
import Link from "next/link";

type ItemRowProps = {
  id: string;
  title: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  itemsIds: string[];
  setItemsIds: (value: string) => void;
};

const ItemRow = ({
  id,
  title,
  price,
  createdAt,
  updatedAt,
  itemsIds,
  setItemsIds,
}: ItemRowProps) => {
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
          checked={itemsIds.includes(id)}
          onChange={() => setItemsIds(id)}
        />
      </td>
      <td>
        <Link className={styles.id_link} href={`/item/${id}`}>
          {id}
        </Link>
      </td>
      <td>
        <Link className={styles.title_link} href={`/item/${id}`}>
          {title}
        </Link>
      </td>
      <td>{price}</td>
      <td>{creationTime}</td>
      <td>{updateTime}</td>
    </tr>
  );
};

export default ItemRow;

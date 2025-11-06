import styles from "./UserRow.module.css";
import { useTranslation } from "react-i18next";

type UserType = {
  id: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  blocked: boolean;
  lastLogin: Date;
  usersIds: string[];
  loggedInUserId: string;
  setUsersIds: (usersIds: string) => void;
};

const UserRow = ({
  id,
  name,
  email,
  role,
  verified,
  blocked,
  lastLogin,
  usersIds,
  loggedInUserId,
  setUsersIds,
}: UserType) => {
  const { t } = useTranslation();
  const status = blocked
    ? t("block1")
    : verified
    ? t("active1")
    : t("unverified");
  const lastSeen = new Date(lastLogin).toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour12: false,
  });

  return (
    <tr
      className={`${styles.data_row} ${
        loggedInUserId === id ? styles.current : ""
      }`}
    >
      <td className={styles.checkbox_con}>
        <input
          type="checkbox"
          id={id}
          checked={usersIds.includes(id)}
          onChange={() => {
            setUsersIds(id);
          }}
        />
      </td>
      <td>{name}</td>
      <td>{email}</td>
      <td>{t(role)}</td>
      <td>{status}</td>
      <td>{lastSeen}</td>
    </tr>
  );
};

export default UserRow;

import styles from "./users.module.css";
import PageTemplate from "@/components/PageTemplate/PageTemplate";
import UserRow from "@/components/UserRow/UserRow";
import * as Icon from "react-bootstrap-icons";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { User } from "@/types/user";
import {
  deleteUsersByIds,
  getAllUsers,
  updateUsersByIds,
} from "../api/userFetch";
import { Option } from "@/types/selectOption";
import { useTranslation } from "react-i18next";
import Select, { SingleValue } from "react-select";
import { selectStyles } from "@/styles/selectStyle";
import { useApp } from "@/context/AppContext";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

const UsersPage = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, currentUser } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [usersIds, setUsersIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<Option>({
    value: "all",
    label: t("all"),
  });
  const [loggedInUserId, setLoggedInUserId] = useState<string>("");
  const router = useRouter();

  const filterOptions: Option[] = [
    { value: "all", label: t("all") },
    { value: "blocked", label: t("blocked") },
    { value: "unverified", label: t("unverified") },
    { value: "active", label: t("active") },
    { value: "newest", label: t("newest") },
    { value: "oldest", label: t("oldest") },
  ];

  const changeFilter = (option: SingleValue<Option>) => {
    if (!option) return;
    setFilter(option);
  };

  const fetchUsers = async () => {
    const response = await getAllUsers();
    setUsers(response.data.users);
  };

  const logoutOnUpdate = (usersIds: string[], loggedInUserId: string) => {
    if (loggedInUserId && usersIds.includes(loggedInUserId)) {
      Cookies.remove("@user_jwt");
      localStorage.clear();
      i18n.changeLanguage("en");
      router.replace("/login");
    }
  };

  const filteredUsers = users
    ? users
        .filter((user) => {
          if (filter.value === "blocked") return user.isBlocked;
          if (filter.value === "unverified")
            return !user.isVerified && !user.isBlocked;
          if (filter.value === "active")
            return !user.isBlocked && user.isVerified;
          return true;
        })
        .sort((a, b) => {
          if (filter.value === "newest")
            return (
              new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime()
            );
          if (filter.value === "oldest")
            return (
              new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime()
            );
          return 0;
        })
    : [];

  const toggleCheckboxes = () => {
    if (!users) return;

    setUsersIds((prevIds) => {
      const allIds = filteredUsers.map((user) => user.id);
      const allSelected = allIds.every((id) => prevIds.includes(id));

      return allSelected ? [] : allIds;
    });
  };

  const deleteUsers = async (usersIds: string[]) => {
    try {
      const response = await deleteUsersByIds(usersIds);

      logoutOnUpdate(usersIds, loggedInUserId);

      if (loggedInUserId && usersIds.includes(loggedInUserId)) {
        localStorage.clear();
        document.documentElement.setAttribute("data-bs-theme", "light");
        return;
      }

      fetchUsers();
    } catch (error) {
      console.log("Error deleting user:", error);
    } finally {
      setUsersIds([]);
    }
  };

  const updateUsers = async (usersIds: string[], statusUpdate: boolean) => {
    try {
      const response = await updateUsersByIds({
        usersIds,
        update: { isBlocked: statusUpdate },
      });

      if (statusUpdate) {
        logoutOnUpdate(usersIds, loggedInUserId);
      }

      if (loggedInUserId && usersIds.includes(loggedInUserId)) {
        localStorage.clear();
        document.documentElement.setAttribute("data-bs-theme", "light");
        return;
      }

      fetchUsers();
    } catch (error) {
      console.log("Error updating user:", error);
    } finally {
      setUsersIds([]);
    }
  };

  const selectedUsersIds = (userId: string) => {
    setUsersIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  useEffect(() => {
    if (currentUser) {
      setLoggedInUserId(currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setUsersIds([]);
  }, [filter]);

  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      label: t(prev.value),
    }));
  }, [i18n.language, t]);

  return (
    <PageTemplate>
      <ProtectedRoute allowedRoles={["admin", "creator"]}>
        <div className={styles.main}>
          <h1>{t("users")}</h1>
          <div className={styles.toolbar}>
            <ul className={styles.buttons_wrapper}>
              <li>
                <Button
                  className={styles.block_btn}
                  disabled={usersIds.length === 0}
                  onClick={() => {
                    updateUsers(usersIds, true);
                  }}
                >
                  <Icon.LockFill />
                  {t("block")}
                </Button>
              </li>
              <li>
                <Button
                  className={styles.unblock_btn}
                  disabled={usersIds.length === 0}
                  onClick={() => {
                    updateUsers(usersIds, false);
                  }}
                >
                  <Icon.UnlockFill />
                </Button>
              </li>
              <li>
                <Button
                  className="btn btn-danger"
                  disabled={usersIds.length === 0}
                  onClick={() => {
                    deleteUsers(usersIds);
                  }}
                >
                  <Icon.Trash3Fill />
                </Button>
              </li>
            </ul>
            <ul className={styles.filter_wrapper}>
              <li>
                <Select
                  inputId="filter"
                  className={styles.filter_select}
                  value={filter}
                  onChange={changeFilter}
                  options={filterOptions}
                  isClearable={false}
                  styles={selectStyles(isDarkMode)}
                />
              </li>
            </ul>
          </div>
          {filteredUsers && filteredUsers.length > 0 ? (
            <Table responsive className={styles.users_table}>
              <thead>
                <tr className={styles.table_heading}>
                  <th className={styles.checkbox_con}>
                    <input
                      type="checkbox"
                      id="select_all"
                      checked={
                        filteredUsers.length > 0 &&
                        filteredUsers.every((u) => usersIds.includes(u.id))
                      }
                      onChange={() => {
                        toggleCheckboxes();
                      }}
                    />
                  </th>
                  <th>{t("name")}</th>
                  <th>{t("email")}</th>
                  <th>{t("role")}</th>
                  <th>{t("status")}</th>
                  <th>{t("lastSeen")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  return (
                    <UserRow
                      key={user.id}
                      id={user.id}
                      name={user.name}
                      email={user.email}
                      role={user.role}
                      verified={user.isVerified}
                      blocked={user.isBlocked}
                      lastLogin={user.lastLogin}
                      setUsersIds={selectedUsersIds}
                      usersIds={usersIds}
                      loggedInUserId={loggedInUserId}
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
              <p>{t("noUsersFound")}</p>
            </div>
          )}
        </div>
      </ProtectedRoute>
    </PageTemplate>
  );
};

export default UsersPage;

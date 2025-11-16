import styles from "./Toolbar.module.css";
import { Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import Select, { SingleValue } from "react-select";
import { useTranslation } from "react-i18next";
import { selectStyles } from "@/styles/selectStyle";
import { useApp } from "@/context/AppContext";
import { Option } from "@/types/selectOption";

type ToolbarProps = {
  filterOptions: Option[];
  filter: Option;
  ids?: string[];
  changeFilter: (value: SingleValue<Option>) => void;
  deleteSomething?: (value: string[]) => void;
  toggleForm?: () => void;
};

const Toolbar = ({
  ids,
  filter,
  filterOptions,
  changeFilter,
  deleteSomething,
  toggleForm,
}: ToolbarProps) => {
  const { t } = useTranslation();
  const { isDarkMode, isLoggedIn } = useApp();
  const hasButtons = toggleForm || deleteSomething;

  return (
    <div
      className={`${styles.toolbar} ${!hasButtons ? styles.no_buttons : ""}`}
    >
      {hasButtons && (
        <ul className={styles.buttons_wrapper}>
          {toggleForm && (
            <li>
              <Button
                disabled={!isLoggedIn}
                className={styles.insert_btn}
                onClick={toggleForm}
              >
                {t("add")}
              </Button>
            </li>
          )}
          {deleteSomething && ids && (
            <li>
              <Button
                className="btn btn-danger"
                disabled={!isLoggedIn || ids.length <= 0}
                onClick={() => deleteSomething(ids)}
              >
                <Icon.Trash3Fill />
              </Button>
            </li>
          )}
        </ul>
      )}
      <ul className={styles.filter_wrapper}>
        <li>
          <Select
            className={styles.filter_select}
            inputId="filter"
            instanceId="filter"
            value={filter}
            onChange={changeFilter}
            options={filterOptions}
            styles={selectStyles(isDarkMode)}
          />
        </li>
      </ul>
    </div>
  );
};

export default Toolbar;

import { StylesConfig } from "react-select";
import { Option } from "@/types/selectOption";

export const selectStyles = (
  darkMode: boolean
): StylesConfig<Option, false> => ({
  control: (provided, state) => ({
    ...provided,
    backgroundColor: darkMode ? "#2c2c2c" : "#fff",
    color: darkMode ? "#fff" : "#000",
    borderColor: state.isFocused ? "#2684FF" : darkMode ? "#555" : "#ccc",
    boxShadow: state.isFocused ? "0 0 0 1px #2684FF" : undefined,
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: darkMode ? "#2c2c2c" : "#fff",
    color: darkMode ? "#fff" : "#000",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? darkMode
        ? "#444"
        : "#eee"
      : darkMode
      ? "#2c2c2c"
      : "#fff",
    color: darkMode ? "#fff" : "#000",
    "&:active": {
      backgroundColor: darkMode ? "#555" : "#ddd",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: darkMode ? "#fff" : "#000",
  }),
});

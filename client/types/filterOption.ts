export type FilterOption =
  | "all"
  | "blocked"
  | "unverified"
  | "active"
  | "newest"
  | "oldest";

export type OptionsForFilter = {
  value: FilterOption;
  label: string;
};

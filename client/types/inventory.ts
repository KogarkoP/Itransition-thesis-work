export type InsertInventory = {
  title: string;
  category: string;
  createdBy: string;
  description: string;
};

export type Inventory = {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  items: string[];
};

export type InventorySettings = {
  title: string;
  description: string;
  category: string;
};

export type InsertItem = {
  title: string;
  price: number;
  description: string;
  createdBy: string;
};

export type Item = {
  id: string;
  title: string;
  price: number;
  description: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

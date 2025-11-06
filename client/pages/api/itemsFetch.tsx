import axios from "axios";
import Cookies from "js-cookie";
import { InsertItem } from "@/types/item";

const BASE_URL = "http://localhost:3005";

export const getAllItems = async (itemsIds: string[]) => {
  const response = await axios.post(`${BASE_URL}/items/inventory-items`, {
    ids: itemsIds,
  });
  return response;
};

export const insertItem = async (item: InsertItem) => {
  const jwt = Cookies.get("@user_jwt");
  const response = await axios.post(`${BASE_URL}/items`, item, {
    headers: { Authorization: jwt },
  });
  return response;
};

export const getItemById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/items/${id}`);
  return response;
};

export const deleteItemsByIds = async (ids: string[]) => {
  const jwt = Cookies.get("@user_jwt");

  const response = await axios.delete(`${BASE_URL}/items/delete`, {
    headers: { Authorization: jwt },
    data: { ids: ids },
  });

  return response;
};

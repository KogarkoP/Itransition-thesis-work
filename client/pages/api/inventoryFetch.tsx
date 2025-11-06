import axios from "axios";
import Cookies from "js-cookie";
import { InsertInventory, InventorySettings } from "@/types/inventory";

const BASE_URL = "https://itransition-thesis-work.onrender.com";

export const getAllInventories = async () => {
  const response = await axios.get(`${BASE_URL}/inventories`);
  return response;
};

export const insertInventory = async (inventory: InsertInventory) => {
  const jwt = Cookies.get("@user_jwt");
  const response = await axios.post(`${BASE_URL}/inventories`, inventory, {
    headers: { Authorization: jwt },
  });
  return response;
};

export const getInventoryById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/inventories/${id}`);
  return response;
};

export const updateInventoryById = async (
  id: string,
  itemsIds: string[],
  userOption: "pull" | "push"
) => {
  const jwt = Cookies.get("@user_jwt");
  const response = await axios.put(
    `${BASE_URL}/inventories/${id}`,
    { itemsIds, userOption },
    {
      headers: { Authorization: jwt },
    }
  );

  return response;
};

export const updateInventorySettingsByID = async (
  id: string,
  inventorySettings: InventorySettings
) => {
  const jwt = Cookies.get("@user_jwt");
  const response = await axios.put(
    `${BASE_URL}/inventories/settings/${id}`,
    inventorySettings,
    {
      headers: { Authorization: jwt },
    }
  );

  return response;
};

export const deleteInventoriesByIds = async (ids: string[]) => {
  const jwt = Cookies.get("@user_jwt");

  const response = await axios.delete(`${BASE_URL}/inventories/delete`, {
    headers: { Authorization: jwt },
    data: { ids: ids },
  });

  return response;
};

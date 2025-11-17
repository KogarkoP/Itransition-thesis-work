import axios from "axios";
import Cookies from "js-cookie";
import { SalesforceUserObject } from "@/types/salesforce";

const BASE_URL = "https://itransition-thesis-work.onrender.com";

export const syncUserToSalesforce = async (user: SalesforceUserObject) => {
  const jwt = Cookies.get("@user_jwt");
  const response = await axios.post(`${BASE_URL}/salesforce/sync`, user, {
    headers: { Authorization: jwt },
  });
  return response;
};

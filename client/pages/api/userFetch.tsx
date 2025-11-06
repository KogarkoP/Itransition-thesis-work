import axios from "axios";
import Cookies from "js-cookie";
import { UserInsert, UpdateUsers, UpdateUser } from "@/types/user";

const BASE_URL = "https://itransition-thesis-work.onrender.com";

export const insertUser = async (user: UserInsert) => {
  const response = await axios.post(`${BASE_URL}/users/register`, user);
  return response;
};

export const getUserById = async (id: string) => {
  const jwt = Cookies.get("@user_jwt");
  const response = await axios.get(`${BASE_URL}/users/${id}`, {
    headers: { Authorization: jwt },
  });

  return response;
};

export const getAllUsers = async () => {
  const jwt = Cookies.get("@user_jwt");
  const response = await axios.get(`${BASE_URL}/users`, {
    headers: { Authorization: jwt },
  });
  return response;
};

export const login = async (logindata: { email: string; password: string }) => {
  const response = await axios.post(`${BASE_URL}/users/login`, logindata);
  return response;
};

export const loginSocialMedia = async (token: string) => {
  const response = await axios.post(
    `${BASE_URL}/users/firebase-login`,
    {},
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response;
};

export const deleteUsersByIds = async (users: string[]) => {
  const jwt = Cookies.get("@user_jwt");

  const response = await axios.delete(`${BASE_URL}/users/delete`, {
    headers: { Authorization: jwt },
    data: { ids: users },
  });

  return response;
};

export const updateUserById = async ({
  userId,
  userOption,
  userValue,
}: UpdateUser) => {
  const jwt = Cookies.get("@user_jwt");
  const response = await axios.put(
    `${BASE_URL}/users/${userId}`,
    {
      userOption: userOption,
      userValue: userValue,
    },

    {
      headers: { Authorization: jwt },
    }
  );

  return response;
};

export const updateUsersByIds = async ({ usersIds, update }: UpdateUsers) => {
  const jwt = Cookies.get("@user_jwt");

  const response = await axios.put(
    `${BASE_URL}/users/bulk-update`,
    {
      usersIds: usersIds,
      update: update,
    },
    {
      headers: { Authorization: jwt },
    }
  );

  return response;
};

export const postRequest = async (body: { [key: string]: string }) => {
  const response = await axios.post(`${BASE_URL}/users/verify-email`, body);
  const data = response.data;

  return data;
};

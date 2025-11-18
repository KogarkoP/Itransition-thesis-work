export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  terms_privacy: boolean;
  isVerified: boolean;
  isBlocked: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
  saleforceSync: boolean;
};

export type UserInsert = {
  name: string;
  email: string;
  password: string;
  terms_privacy: boolean;
};

export type UpdateUser = {
  userId: string;
  userOption: string;
  userValue: string | boolean;
};

export type UpdateUsers = {
  usersIds: string[];
  update: Record<string, boolean>;
};

export type LoginUser = {
  id: string;
  language: string;
  theme: string;
  isBlocked: boolean;
};

export type LoginResponse = {
  jwt: string;
  user: LoginUser;
};

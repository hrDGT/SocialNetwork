export type LoginPayload = {
  username: string;
  password: string;
  expiresInMins?: number;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
};

export type AuthUser = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  token: string;
};

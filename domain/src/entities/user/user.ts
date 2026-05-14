export type Role = "ADMIN" | "USER";

export type User = {
  id: string;
  username: string;
  email: string;
  role: Role;
};
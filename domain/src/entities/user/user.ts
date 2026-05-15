export type UserRole =
  | "user"
  | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
};
import { User } from "../entities/user/user";

export interface UserRepository {
  create(
    data: Omit<
      User,
      "id"
    >
  ): Promise<User>;

  findByEmail(email: string): Promise<User | null>;

  findById(id: string): Promise<User | null>;

  list(): Promise<User[]>;
}
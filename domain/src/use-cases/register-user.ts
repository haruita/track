import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/UserRepository";

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: {
    username: string;
    email: string;
    password: string;
  }) {
    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.userRepository.create({
      username: data.username,
      email: data.email,
      passwordHash,
      role: "USER",
    });
  }
}
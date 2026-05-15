import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/UserRepository";

export class LoginUserUseCase { constructor (private userRepository: UserRepository) {}

  async execute(data: {
    email: string;
    password: string;
  }) {
    const user =
      await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const validPassword =
      await bcrypt.compare(
        data.password,
        user.passwordHash
      );

    if (!validPassword) {
      throw new Error("Invalid credentials");
    }

    return user;
  }
}
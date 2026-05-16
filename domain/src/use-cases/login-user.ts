import { UserRepository } from "../repositories/UserRepository";
import { PasswordHasher } from "../repositories/PasswordHasher";

export class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(data: {
    email: string;
    password: string;
  }) {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const validPassword = await this.passwordHasher.compare(
      data.password,
      user.passwordHash
    );

    if (!validPassword) {
      throw new Error("Invalid credentials");
    }

    return user;
  }
}

import { UserRepository } from "../repositories/UserRepository";
import { PasswordHasher } from "../repositories/PasswordHasher";

export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(data: {
    username: string;
    email: string;
    password: string;
  }) {
    const passwordHash = await this.passwordHasher.hash(data.password);

    return this.userRepository.create({
      username: data.username,
      email: data.email,
      passwordHash,
      role: "USER",
    });
  }
}

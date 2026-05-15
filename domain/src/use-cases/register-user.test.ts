import { expect, test, describe, vi, beforeEach } from "vitest";
import { RegisterUserUseCase } from "./register-user";
import type { UserRepository } from "../repositories/UserRepository";

describe("RegisterUserUseCase", () => {
  let userRepository: UserRepository;
  let useCase: RegisterUserUseCase;

  beforeEach(() => {
    userRepository = {
      create: vi.fn(),
      findByEmail: vi.fn(),
      findById: vi.fn(),
      list: vi.fn(),
    };
    useCase = new RegisterUserUseCase(userRepository);
  });

  test("hashes the password before creating user", async () => {
    const createdUser = {
      id: "1",
      username: "testuser",
      email: "test@test.com",
      passwordHash: "$2a$10$hashed",
      role: "USER",
    };

    vi.mocked(userRepository.create).mockResolvedValue(createdUser);

    await useCase.execute({
      username: "testuser",
      email: "test@test.com",
      password: "secret123",
    });

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        username: "testuser",
        email: "test@test.com",
        role: "USER",
      })
    );

    const callArg = vi.mocked(userRepository.create).mock.calls[0][0];
    expect(callArg.passwordHash).toBeDefined();
    expect(callArg.passwordHash).not.toBe("secret123");
  });

  test("assigns USER role by default", async () => {
    const createdUser = {
      id: "1",
      username: "testuser",
      email: "test@test.com",
      passwordHash: "$2a$10$hashed",
      role: "USER",
    };

    vi.mocked(userRepository.create).mockResolvedValue(createdUser);

    const result = await useCase.execute({
      username: "testuser",
      email: "test@test.com",
      password: "secret123",
    });

    expect(result.role).toBe("USER");
  });

  test("returns the created user", async () => {
    const createdUser = {
      id: "user-123",
      username: "newuser",
      email: "new@test.com",
      passwordHash: "$2a$10$hashed",
      role: "USER",
    };

    vi.mocked(userRepository.create).mockResolvedValue(createdUser);

    const result = await useCase.execute({
      username: "newuser",
      email: "new@test.com",
      password: "password",
    });

    expect(result).toEqual(createdUser);
  });
});

import { expect, test, describe, vi, beforeEach } from "vitest";
import { LoginUserUseCase } from "./login-user";
import type { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcryptjs";

describe("LoginUserUseCase", () => {
  let userRepository: UserRepository;
  let useCase: LoginUserUseCase;

  beforeEach(() => {
    userRepository = {
      create: vi.fn(),
      findByEmail: vi.fn(),
      findById: vi.fn(),
      list: vi.fn(),
    };
    useCase = new LoginUserUseCase(userRepository);
  });

  test("throws error when user does not exist", async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: "unknown@test.com",
        password: "password",
      })
    ).rejects.toThrow("Invalid credentials");
  });

  test("throws error when password is incorrect", async () => {
    const user = {
      id: "1",
      username: "testuser",
      email: "test@test.com",
      passwordHash: await bcrypt.hash("correctpassword", 10),
      role: "USER",
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValue(user);

    await expect(
      useCase.execute({
        email: "test@test.com",
        password: "wrongpassword",
      })
    ).rejects.toThrow("Invalid credentials");
  });

  test("returns user when credentials are valid", async () => {
    const user = {
      id: "user-123",
      username: "testuser",
      email: "test@test.com",
      passwordHash: await bcrypt.hash("correctpassword", 10),
      role: "USER",
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValue(user);

    const result = await useCase.execute({
      email: "test@test.com",
      password: "correctpassword",
    });

    expect(result).toEqual(user);
  });

  test("finds user by email", async () => {
    const user = {
      id: "1",
      username: "testuser",
      email: "test@test.com",
      passwordHash: await bcrypt.hash("password", 10),
      role: "USER",
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValue(user);

    await useCase.execute({
      email: "test@test.com",
      password: "password",
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith("test@test.com");
  });
});

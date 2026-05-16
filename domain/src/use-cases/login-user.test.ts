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

  test("should throw 'Invalid credentials' when user does not exist", async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: "unknown@test.com",
        password: "any-password",
      })
    ).rejects.toThrow("Invalid credentials");
  });

  test("should throw 'Invalid credentials' when password is wrong", async () => {
    const user = {
      id: "1",
      username: "testuser",
      email: "test@test.com",
      passwordHash: await bcrypt.hash("correct-password", 10),
      role: "USER",
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValue(user);

    await expect(
      useCase.execute({
        email: "test@test.com",
        password: "wrong-password",
      })
    ).rejects.toThrow("Invalid credentials");
  });

  test("should throw 'Invalid credentials' when password is empty", async () => {
    const user = {
      id: "1",
      username: "testuser",
      email: "test@test.com",
      passwordHash: await bcrypt.hash("correct-password", 10),
      role: "USER",
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValue(user);

    await expect(
      useCase.execute({
        email: "test@test.com",
        password: "",
      })
    ).rejects.toThrow("Invalid credentials");
  });

  test("should return user when email and password are correct", async () => {
    const user = {
      id: "user-123",
      username: "testuser",
      email: "test@test.com",
      passwordHash: await bcrypt.hash("correct-password", 10),
      role: "USER",
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValue(user);

    const result = await useCase.execute({
      email: "test@test.com",
      password: "correct-password",
    });

    expect(result).toEqual(user);
  });

  test("should query repository by email", async () => {
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

  test("should not call create, findById or list during login", async () => {
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

    expect(userRepository.create).not.toHaveBeenCalled();
    expect(userRepository.findById).not.toHaveBeenCalled();
    expect(userRepository.list).not.toHaveBeenCalled();
  });
});

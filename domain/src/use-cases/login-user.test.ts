import { expect, test, describe, vi, beforeEach } from "vitest";
import { LoginUserUseCase } from "./login-user";
import type { UserRepository } from "../repositories/UserRepository";
import type { PasswordHasher } from "../repositories/PasswordHasher";

describe("LoginUserUseCase", () => {
  let userRepository: UserRepository;
  let passwordHasher: PasswordHasher;
  let useCase: LoginUserUseCase;

  beforeEach(() => {
    userRepository = {
      create: vi.fn(),
      findByEmail: vi.fn(),
      findById: vi.fn(),
      list: vi.fn(),
    };
    passwordHasher = {
      hash: vi.fn(),
      compare: vi.fn(),
    };
    useCase = new LoginUserUseCase(userRepository, passwordHasher);
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

  test("should throw 'Invalid credentials' when password comparison fails", async () => {
    const user = {
      id: "1",
      username: "testuser",
      email: "test@test.com",
      passwordHash: "$2a$10$hashed",
      role: "USER",
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValue(user);
    vi.mocked(passwordHasher.compare).mockResolvedValue(false);

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
      passwordHash: "$2a$10$hashed",
      role: "USER",
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValue(user);
    vi.mocked(passwordHasher.compare).mockResolvedValue(false);

    await expect(
      useCase.execute({
        email: "test@test.com",
        password: "",
      })
    ).rejects.toThrow("Invalid credentials");
  });

  test("should return user when credentials are valid", async () => {
    const user = {
      id: "user-123",
      username: "testuser",
      email: "test@test.com",
      passwordHash: "$2a$10$hashed",
      role: "USER",
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValue(user);
    vi.mocked(passwordHasher.compare).mockResolvedValue(true);

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
      passwordHash: "$2a$10$hashed",
      role: "USER",
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValue(user);
    vi.mocked(passwordHasher.compare).mockResolvedValue(true);

    await useCase.execute({
      email: "test@test.com",
      password: "password",
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith("test@test.com");
  });

  test("should use injected passwordHasher.compare for verification", async () => {
    const user = {
      id: "1",
      username: "testuser",
      email: "test@test.com",
      passwordHash: "$2a$10$hashed",
      role: "USER",
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValue(user);
    vi.mocked(passwordHasher.compare).mockResolvedValue(true);

    await useCase.execute({
      email: "test@test.com",
      password: "password",
    });

    expect(passwordHasher.compare).toHaveBeenCalledWith("password", "$2a$10$hashed");
  });

  test("should not call create, findById or list during login", async () => {
    const user = {
      id: "1",
      username: "testuser",
      email: "test@test.com",
      passwordHash: "$2a$10$hashed",
      role: "USER",
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValue(user);
    vi.mocked(passwordHasher.compare).mockResolvedValue(true);

    await useCase.execute({
      email: "test@test.com",
      password: "password",
    });

    expect(userRepository.create).not.toHaveBeenCalled();
    expect(userRepository.findById).not.toHaveBeenCalled();
    expect(userRepository.list).not.toHaveBeenCalled();
  });
});

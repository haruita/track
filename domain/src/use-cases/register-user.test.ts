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

  test("should hash the password before passing it to the repository", async () => {
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

    const callArg = vi.mocked(userRepository.create).mock.calls[0][0];
    expect(callArg.passwordHash).not.toBe("secret123");
    expect(typeof callArg.passwordHash).toBe("string");
    expect(callArg.passwordHash.length).toBeGreaterThan(10);
  });

  test("should assign USER role by default regardless of input", async () => {
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

  test("should return the user created by the repository", async () => {
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

  test("should delegate to userRepository.create with correct data", async () => {
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
  });

  test("should throw if repository.create fails", async () => {
    vi.mocked(userRepository.create).mockRejectedValue(
      new Error("Unique constraint failed on email")
    );

    await expect(
      useCase.execute({
        username: "testuser",
        email: "test@test.com",
        password: "secret123",
      })
    ).rejects.toThrow("Unique constraint failed on email");
  });
});

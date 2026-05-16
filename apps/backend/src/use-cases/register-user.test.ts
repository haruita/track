import { expect, test, describe, vi, beforeEach } from "vitest";

vi.mock("../prisma/client", () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "../prisma/client";
import { registerUser } from "./register-user";

describe("registerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should create a user with a hashed password, not the plain text one", async () => {
    const createdUser = {
      id: "user-1",
      username: "testuser",
      email: "test@test.com",
      passwordHash: "$2b$10$hashed",
      role: "USER",
    };

    vi.mocked(prisma.user.create).mockResolvedValue(createdUser);

    const result = await registerUser({
      username: "testuser",
      email: "test@test.com",
      password: "secret123",
    });

    const callData = vi.mocked(prisma.user.create).mock.calls[0][0].data;
    expect(callData.passwordHash).not.toBe("secret123");
    expect(typeof callData.passwordHash).toBe("string");
    expect(result).toEqual(createdUser);
  });

  test("should pass username and email to prisma create", async () => {
    const createdUser = {
      id: "user-1",
      username: "testuser",
      email: "test@test.com",
      passwordHash: "$2b$10$hashed",
      role: "USER",
    };

    vi.mocked(prisma.user.create).mockResolvedValue(createdUser);

    await registerUser({
      username: "testuser",
      email: "test@test.com",
      password: "secret123",
    });

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        username: "testuser",
        email: "test@test.com",
      }),
    });
  });

  test("should return the user object from prisma", async () => {
    const createdUser = {
      id: "new-user",
      username: "newuser",
      email: "new@test.com",
      passwordHash: "$2b$10$hashed",
      role: "USER",
    };

    vi.mocked(prisma.user.create).mockResolvedValue(createdUser);

    const result = await registerUser({
      username: "newuser",
      email: "new@test.com",
      password: "password",
    });

    expect(result).toEqual(createdUser);
  });

  test("should propagate prisma error when create fails", async () => {
    vi.mocked(prisma.user.create).mockRejectedValue(
      new Error("Unique constraint failed on the fields: `email`")
    );

    await expect(
      registerUser({
        username: "testuser",
        email: "duplicate@test.com",
        password: "secret123",
      })
    ).rejects.toThrow("Unique constraint failed on the fields: `email`");
  });
});

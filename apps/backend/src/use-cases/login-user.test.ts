import { expect, test, describe, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";

vi.mock("../prisma/client", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("../auth/jwt", () => ({
  generateToken: vi.fn(),
  verifyToken: vi.fn(),
}));

import { prisma } from "../prisma/client";
import { generateToken } from "../auth/jwt";
import { loginUser } from "./login-user";

describe("loginUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should throw 'Invalid credentials.' when user does not exist", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    await expect(
      loginUser({ email: "unknown@test.com", password: "any-password" })
    ).rejects.toThrow("Invalid credentials.");
  });

  test("should throw 'Invalid credentials.' when password is wrong", async () => {
    const user = {
      id: "1",
      username: "testuser",
      email: "test@test.com",
      passwordHash: await bcrypt.hash("correct-password", 10),
      role: "USER",
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(user);

    await expect(
      loginUser({ email: "test@test.com", password: "wrong-password" })
    ).rejects.toThrow("Invalid credentials.");
  });

  test("should throw 'Invalid credentials.' when password is empty", async () => {
    const user = {
      id: "1",
      username: "testuser",
      email: "test@test.com",
      passwordHash: await bcrypt.hash("correct-password", 10),
      role: "USER",
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(user);

    await expect(
      loginUser({ email: "test@test.com", password: "" })
    ).rejects.toThrow("Invalid credentials.");
  });

  test("should return a JWT token when credentials are correct", async () => {
    const user = {
      id: "user-123",
      username: "testuser",
      email: "test@test.com",
      passwordHash: await bcrypt.hash("correct-password", 10),
      role: "USER",
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(user);
    vi.mocked(generateToken).mockReturnValue("mock-jwt-token");

    const result = await loginUser({
      email: "test@test.com",
      password: "correct-password",
    });

    expect(result).toBe("mock-jwt-token");
  });

  test("should call generateToken with user id and role", async () => {
    const user = {
      id: "user-123",
      username: "testuser",
      email: "test@test.com",
      passwordHash: await bcrypt.hash("correct-password", 10),
      role: "USER",
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(user);
    vi.mocked(generateToken).mockReturnValue("mock-jwt-token");

    await loginUser({
      email: "test@test.com",
      password: "correct-password",
    });

    expect(generateToken).toHaveBeenCalledWith({
      id: "user-123",
      role: "USER",
    });
  });

  test("should include ADMIN role in token for admin users", async () => {
    const admin = {
      id: "admin-1",
      username: "admin",
      email: "admin@test.com",
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(admin);
    vi.mocked(generateToken).mockReturnValue("admin-jwt-token");

    await loginUser({ email: "admin@test.com", password: "admin123" });

    expect(generateToken).toHaveBeenCalledWith({
      id: "admin-1",
      role: "ADMIN",
    });
  });
});

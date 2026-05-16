import { expect, test, describe, vi, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";

vi.mock("../prisma/client", () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe("POST /auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    vi.resetModules();
  });

  test("should create a user and return it with status 200", async () => {
    const { prisma } = await import("../prisma/client");
    const { app } = await import("../app");

    const createdUser = {
      id: "user-1",
      username: "testuser",
      email: "test@test.com",
      passwordHash: "$2b$10$hashed",
      role: "USER",
    };

    vi.mocked(prisma.user.create).mockResolvedValue(createdUser as any);

    const response = await request(app)
      .post("/auth/register")
      .send({
        username: "testuser",
        email: "test@test.com",
        password: "secret123",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", "user-1");
    expect(response.body).toHaveProperty("username", "testuser");
    expect(response.body).toHaveProperty("email", "test@test.com");
  });

  test("should return 400 when registration fails", async () => {
    const { prisma } = await import("../prisma/client");
    const { app } = await import("../app");

    vi.mocked(prisma.user.create).mockRejectedValue(new Error("DB error"));

    const response = await request(app)
      .post("/auth/register")
      .send({
        username: "testuser",
        email: "test@test.com",
        password: "secret123",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("should return 400 when registration fails due to duplicate email", async () => {
    const { prisma } = await import("../prisma/client");
    const { app } = await import("../app");

    vi.mocked(prisma.user.create).mockRejectedValue(new Error("Unique constraint"));

    const response = await request(app)
      .post("/auth/register")
      .send({
        username: "testuser",
        email: "duplicate@test.com",
        password: "secret123",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

describe("POST /auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    vi.resetModules();
  });

  test("should return a token with status 200 when credentials are valid", async () => {
    const { prisma } = await import("../prisma/client");
    const { app } = await import("../app");

    const user = {
      id: "user-1",
      username: "testuser",
      email: "test@test.com",
      passwordHash: await bcrypt.hash("secret123", 10),
      role: "USER",
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any);

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "test@test.com",
        password: "secret123",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  test("should return 401 when user does not exist", async () => {
    const { prisma } = await import("../prisma/client");
    const { app } = await import("../app");

    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "nonexistent@test.com",
        password: "any-password",
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return 401 when password is incorrect", async () => {
    const { prisma } = await import("../prisma/client");
    const { app } = await import("../app");

    const user = {
      id: "user-1",
      username: "testuser",
      email: "test@test.com",
      passwordHash: await bcrypt.hash("correct-password", 10),
      role: "USER",
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any);

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "test@test.com",
        password: "wrong-password",
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should return 401 when password is empty", async () => {
    const { prisma } = await import("../prisma/client");
    const { app } = await import("../app");

    const user = {
      id: "user-1",
      username: "testuser",
      email: "test@test.com",
      passwordHash: await bcrypt.hash("correct-password", 10),
      role: "USER",
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any);

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "test@test.com",
        password: "",
      });

    expect(response.status).toBe(401);
  });
});

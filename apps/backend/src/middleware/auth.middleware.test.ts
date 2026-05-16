import { expect, test, describe, vi, beforeEach } from "vitest";

describe("authMiddleware", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
    vi.resetModules();
  });

  test("should return 401 when authorization header is missing", async () => {
    const { authMiddleware } = await import("./auth.middleware");

    const req = { headers: {} } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Missing token" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 when authorization header is empty", async () => {
    const { authMiddleware } = await import("./auth.middleware");

    const req = { headers: { authorization: "" } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 when authorization header has no token after Bearer", async () => {
    const { authMiddleware } = await import("./auth.middleware");

    const req = { headers: { authorization: "Bearer" } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 when token is invalid", async () => {
    const { authMiddleware } = await import("./auth.middleware");

    const req = { headers: { authorization: "Bearer not-a-real-token" } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should call next and attach decoded user to request when token is valid", async () => {
    const { authMiddleware } = await import("./auth.middleware");
    const { generateToken } = await import("../auth/jwt");

    const token = generateToken({ id: "user-1", role: "USER" });
    const req = { headers: { authorization: `Bearer ${token}` } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(
      expect.objectContaining({ id: "user-1", role: "USER" })
    );
  });

  test("should correctly decode admin role from token", async () => {
    const { authMiddleware } = await import("./auth.middleware");
    const { generateToken } = await import("../auth/jwt");

    const token = generateToken({ id: "admin-1", role: "ADMIN" });
    const req = { headers: { authorization: `Bearer ${token}` } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.role).toBe("ADMIN");
  });

  test("should not call res.json when token is valid", async () => {
    const { authMiddleware } = await import("./auth.middleware");
    const { generateToken } = await import("../auth/jwt");

    const token = generateToken({ id: "user-1", role: "USER" });
    const req = { headers: { authorization: `Bearer ${token}` } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.json).not.toHaveBeenCalled();
  });
});

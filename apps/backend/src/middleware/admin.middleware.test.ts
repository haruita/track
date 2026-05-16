import { expect, test, describe, vi } from "vitest";
import { adminMiddleware } from "./admin.middleware";

describe("adminMiddleware", () => {
  test("should return 403 when user is not authenticated", () => {
    const req = { user: undefined } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    adminMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 403 when user role is USER", () => {
    const req = { user: { id: "1", role: "USER" } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    adminMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 403 when user object exists but has no role", () => {
    const req = { user: { id: "1" } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    adminMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("should call next when user role is ADMIN", () => {
    const req = { user: { id: "1", role: "ADMIN" } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    adminMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test("should not modify the request or response when user is admin", () => {
    const req = { user: { id: "admin-1", role: "ADMIN" } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    adminMiddleware(req, res, next);

    expect(req.user).toEqual({ id: "admin-1", role: "ADMIN" });
    expect(res.status).not.toHaveBeenCalled();
  });
});

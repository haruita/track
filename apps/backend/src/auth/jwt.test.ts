import { expect, test, describe, beforeEach, afterEach } from "vitest";

describe("jwt", () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret-key";
    vi.resetModules();
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  test("generateToken returns a string token", async () => {
    const { generateToken } = await import("./jwt");

    const token = generateToken({ id: "user-1", role: "USER" });

    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  test("verifyToken decodes the payload correctly", async () => {
    const { generateToken, verifyToken } = await import("./jwt");

    const payload = { id: "user-123", role: "ADMIN" };
    const token = generateToken(payload);
    const decoded = verifyToken(token) as typeof payload;

    expect(decoded.id).toBe("user-123");
    expect(decoded.role).toBe("ADMIN");
  });

  test("verifyToken throws on invalid token", async () => {
    const { verifyToken } = await import("./jwt");

    expect(() => verifyToken("invalid-token-string")).toThrow();
  });

  test("token includes exp claim", async () => {
    const { generateToken, verifyToken } = await import("./jwt");

    const token = generateToken({ id: "1", role: "USER" });
    const decoded = verifyToken(token) as { exp: number; iat: number };

    expect(decoded.exp).toBeDefined();
    expect(decoded.iat).toBeDefined();
    expect(decoded.exp).toBeGreaterThan(decoded.iat);
  });
});

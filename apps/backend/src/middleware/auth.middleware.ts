import { Request, Response, NextFunction } from "express";

import { verifyToken } from "../auth/jwt";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

if (!authHeader) {
  return res.status(401).json({
    message: "Missing token",
  });
}

const token = authHeader.split(" ")[1];

if (!token) {
  return res.status(401).json({
    message: "Invalid token format",
  });
}

const decoded = verifyToken(token);
}
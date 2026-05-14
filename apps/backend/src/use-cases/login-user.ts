import bcrypt from "bcrypt";

import { prisma } from "../prisma/client";

import { generateToken } from "../auth/jwt";

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials.");
  }

  const valid = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

  if (!valid) {
    throw new Error("Invalid credentials.");
  }

  return generateToken({
    id: user.id,
    role: user.role,
  });
}
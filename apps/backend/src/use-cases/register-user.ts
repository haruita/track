import bcrypt from "bcrypt";

import { prisma } from "../prisma/client";

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  const passwordHash =
    await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash,
    },
  });
}
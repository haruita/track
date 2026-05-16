import { prisma } from "../prisma/client";
import { UserRepository } from "../../../../domain/src/repositories/UserRepository";
import { User } from "../../../../domain/src/entities/user/user";

export class PrismaUserRepository implements UserRepository {
  async create(data: Omit<User, "id">): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async update(id: string, data: Partial<Omit<User, "id">>): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async list(): Promise<User[]> {
    return prisma.user.findMany();
  }
}

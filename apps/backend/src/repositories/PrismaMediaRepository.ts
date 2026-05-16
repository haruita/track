import {
  MediaRepository,
  MediaRecord,
  MediaCreateData,
  MediaUpdateData,
} from "../../../../domain/src/repositories/MediaRepository";
import { prisma } from "../prisma/client";

export class PrismaMediaRepository implements MediaRepository {
  async create(data: MediaCreateData): Promise<MediaRecord> {
    return prisma.media.create({ data });
  }

  async findById(id: string): Promise<MediaRecord | null> {
    return prisma.media.findUnique({ where: { id } });
  }

  async findAll(query?: string): Promise<MediaRecord[]> {
    if (query) {
      return prisma.media.findMany({
        where: { title: { contains: query } },
      });
    }
    return prisma.media.findMany();
  }

  async update(id: string, data: MediaUpdateData): Promise<MediaRecord> {
    return prisma.media.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.media.delete({ where: { id } });
  }
}

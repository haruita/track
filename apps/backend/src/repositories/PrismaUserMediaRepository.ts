import {
  UserMediaRepository,
  UserMediaRecord,
  UpdateProgressAction,
} from "../../../../domain/src/repositories/UserMediaRepository";
import { prisma } from "../prisma/client";

export class PrismaUserMediaRepository implements UserMediaRepository {
  async findByUserId(userId: string): Promise<UserMediaRecord[]> {
    return prisma.userMedia.findMany({
      where: { userId },
      include: { media: true },
    });
  }

  async findById(id: string): Promise<UserMediaRecord | null> {
    return prisma.userMedia.findUnique({
      where: { id },
      include: { media: true },
    });
  }

  async findByUserAndMedia(
    userId: string,
    mediaId: string
  ): Promise<UserMediaRecord | null> {
    return prisma.userMedia.findUnique({
      where: { userId_mediaId: { userId, mediaId } },
      include: { media: true },
    });
  }

  async create(userId: string, mediaId: string): Promise<UserMediaRecord> {
    return prisma.userMedia.create({
      data: { userId, mediaId, progressCurrent: 0 },
      include: { media: true },
    });
  }

  async updateProgress(
    id: string,
    action: UpdateProgressAction,
    maxProgress: number
  ): Promise<UserMediaRecord> {
    const userMedia = await this.findById(id);
    if (!userMedia) {
      throw new Error("UserMedia not found");
    }

    const current = userMedia.progressCurrent;
    let newCurrent = current;

    if (action.action === "increment" && current < maxProgress) {
      newCurrent = current + 1;
    } else if (action.action === "decrement" && current > 0) {
      newCurrent = current - 1;
    } else if (action.action === "set") {
      newCurrent = Math.max(0, Math.min(action.value, maxProgress));
    }

    return prisma.userMedia.update({
      where: { id },
      data: { progressCurrent: newCurrent },
      include: { media: true },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await prisma.userMedia.delete({
      where: { id, userId },
    });
  }
}

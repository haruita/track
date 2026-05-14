import { prisma } from "../prisma/client";

export async function createMedia(data: any) {
  return prisma.media.create({
    data,
  });
}

export async function getMedia() {
  return prisma.media.findMany();
}

export async function updateMedia(
  id: string,
  data: any
) {
  return prisma.media.update({
    where: { id },
    data,
  });
}

export async function deleteMedia(id: string) {
  return prisma.media.delete({
    where: { id },
  });
}
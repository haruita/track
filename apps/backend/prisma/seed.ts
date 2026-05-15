import { prisma } from "../src/prisma/client";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");

const COVER_IMAGES = [
  "445f6d52-ecb2-47ad-a261-51245b626630.jpg",
  "7a0c050a-519d-42df-84ff-152594962b39.jpeg",
  "91b05093-6cd4-4a1d-8f44-0372082f16b1.webp",
];

async function main() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const existingMedia = await prisma.media.count();
  if (existingMedia > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  const availableFiles = COVER_IMAGES.filter((f) =>
    fs.existsSync(path.join(UPLOADS_DIR, f))
  );

  console.log(`Found ${availableFiles.length} cover image(s)`);

  const getImage = (index: number) =>
    availableFiles.length > 0
      ? `/uploads/${availableFiles[index % availableFiles.length]}`
      : null;

  console.log("Creating media entries...");

  await prisma.media.createMany({
    data: [
      {
        title: "Steins;Gate",
        type: "anime",
        activity: "watch",
        status: "watching",
        progressTotal: 24,
        progressUnit: "episode",
        description: "A group of friends discover a method of time travel through modified microwaves.",
        imageUrl: getImage(0),
      },
      {
        title: "Umineko no Naku Koro ni",
        type: "visual_novel",
        activity: "read",
        status: "reading",
        progressTotal: 8,
        progressUnit: "chapter",
        description: "A family gathering on a remote island turns into a battle of wits against a mysterious witch.",
        imageUrl: getImage(1),
      },
      {
        title: "NieR: Automata",
        type: "game",
        activity: "play",
        status: "playing",
        progressTotal: 60,
        progressUnit: "hour",
        description: "Androids 2B, 9S and A2 fight to reclaim a world overrun by machines.",
        imageUrl: getImage(2),
      },
    ],
  });

  const adminExists = await prisma.user.findUnique({
    where: { email: "admin@test.com" },
  });

  if (!adminExists) {
    console.log("Creating admin user...");
    const hash = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        username: "admin",
        email: "admin@test.com",
        passwordHash: hash,
        role: "ADMIN",
      },
    });
  }

  console.log("Seed completed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

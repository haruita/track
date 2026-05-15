import { prisma } from "../src/prisma/client";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");

async function downloadImage(url: string, filename: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    const filePath = path.join(UPLOADS_DIR, filename);

    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  } catch {
    console.log(`Failed to download ${url}, using placeholder`);
    return null;
  }
}

async function main() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const existingMedia = await prisma.media.count();
  if (existingMedia > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  console.log("Downloading cover images...");

  const steinsGateImg = await downloadImage(
    "https://cdn.myanimelist.net/images/anime/1935/127978l.jpg",
    "steins-gate.jpg"
  );

  const uminekoImg = await downloadImage(
    "https://cdn.myanimelist.net/images/manga/1/219546l.jpg",
    "umineko.jpg"
  );

  const nierImg = await downloadImage(
    "https://cdn.myanimelist.net/images/games/1/345845l.jpg",
    "nier-automata.jpg"
  );

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
        imageUrl: steinsGateImg,
      },
      {
        title: "Umineko no Naku Koro ni",
        type: "visual_novel",
        activity: "read",
        status: "reading",
        progressTotal: 8,
        progressUnit: "chapter",
        description: "A family gathering on a remote island turns into a battle of wits against a mysterious witch.",
        imageUrl: uminekoImg,
      },
      {
        title: "NieR: Automata",
        type: "game",
        activity: "play",
        status: "playing",
        progressTotal: 60,
        progressUnit: "hour",
        description: "Androids 2B, 9S and A2 fight to reclaim a world overrun by machines.",
        imageUrl: nierImg,
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

import { prisma } from "../src/prisma/client";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");
const SEED_IMAGES_DIR = path.resolve(__dirname, "seed-images");

const COVER_IMAGES = [
  { filename: "steins-gate.jpg", mediaTitle: "Steins;Gate" },
  { filename: "umineko.jpeg", mediaTitle: "Umineko no Naku Koro ni" },
  { filename: "nier-automata.webp", mediaTitle: "NieR: Automata" },
];

function copySeedImages(): string[] {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const copied: string[] = [];

  for (const { filename } of COVER_IMAGES) {
    const src = path.join(SEED_IMAGES_DIR, filename);
    const dest = path.join(UPLOADS_DIR, filename);

    if (fs.existsSync(src) && !fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
      copied.push(filename);
    }
  }

  return copied;
}

async function main() {
  const existingMedia = await prisma.media.count();
  if (existingMedia > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  const copied = copySeedImages();
  console.log(`Copied ${copied.length} cover image(s) to uploads/`);

  const availableFiles = COVER_IMAGES.filter(({ filename }) =>
    fs.existsSync(path.join(UPLOADS_DIR, filename))
  );

  const getImage = (index: number) =>
    availableFiles.length > 0
      ? `/uploads/${availableFiles[index % availableFiles.length].filename}`
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

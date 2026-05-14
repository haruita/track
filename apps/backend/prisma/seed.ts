import { prisma } from "../src/prisma/client";

async function main() {
  await prisma.media.createMany({
    data: [
      {
        title: "Steins;Gate",
        type: "anime",
        activity: "watch",
        status: "watching",
        progressCurrent: 12,
        progressTotal: 24,
        progressUnit: "episode",
      },

      {
        title: "Umineko no Naku Koro ni",
        type: "visual_novel",
        activity: "read",
        status: "reading",
        progressCurrent: 3,
        progressTotal: 8,
        progressUnit: "chapter",
      },

      {
        title: "NieR: Automata",
        type: "game",
        activity: "play",
        status: "playing",
        progressCurrent: 14,
        progressTotal: 60,
        progressUnit: "hour",
      },
    ],
  });

  console.log("Seed completed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
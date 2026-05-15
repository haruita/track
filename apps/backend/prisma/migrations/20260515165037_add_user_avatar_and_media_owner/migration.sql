-- AlterTable
ALTER TABLE "User" ADD COLUMN "avatarUrl" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "progressCurrent" INTEGER NOT NULL,
    "progressTotal" INTEGER,
    "progressUnit" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "userId" TEXT,
    CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Media" ("activity", "description", "id", "imageUrl", "progressCurrent", "progressTotal", "progressUnit", "status", "title", "type") SELECT "activity", "description", "id", "imageUrl", "progressCurrent", "progressTotal", "progressUnit", "status", "title", "type" FROM "Media";
DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

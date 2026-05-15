-- Drop progressCurrent and userId from Media
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "progressTotal" INTEGER,
    "progressUnit" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT
);

INSERT INTO "new_Media" ("id", "title", "type", "activity", "status", "progressTotal", "progressUnit", "description", "imageUrl")
SELECT "id", "title", "type", "activity", "status", "progressTotal", "progressUnit", "description", "imageUrl" FROM "Media";

DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";

-- Create UserMedia table
CREATE TABLE "UserMedia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "progressCurrent" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "UserMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "UserMedia_userId_mediaId_key" ON "UserMedia"("userId", "mediaId");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

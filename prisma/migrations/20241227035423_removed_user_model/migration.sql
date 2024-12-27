/*
  Warnings:

  - You are about to drop the column `userId` on the `Film` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Film" DROP CONSTRAINT "Film_userId_fkey";

-- DropForeignKey
ALTER TABLE "StreamingService" DROP CONSTRAINT "StreamingService_userId_fkey";

-- DropIndex
DROP INDEX "Film_userId_name_year_key";

-- AlterTable
ALTER TABLE "Film" DROP COLUMN "userId";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "TVShow" (
    "id" TEXT NOT NULL,
    "streamingServiceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "genre" "Genre" NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TVShow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seasons" (
    "id" TEXT NOT NULL,
    "tvShowId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "noOfEpisodes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seasons_pkey" PRIMARY KEY ("id")
);

/*
  Warnings:

  - You are about to drop the column `streamingServiceId` on the `TVShow` table. All the data in the column will be lost.
  - You are about to drop the `Seasons` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "StreamingService" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "TVShow" DROP COLUMN "streamingServiceId",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Seasons";

-- CreateTable
CREATE TABLE "TvShowStreamingService" (
    "id" TEXT NOT NULL,
    "tvShowId" TEXT NOT NULL,
    "streamingServiceId" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TvShowStreamingService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "tvShowStreamingServiceId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "noOfEpisodes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TvShowStreamingService_tvShowId_streamingServiceId_key" ON "TvShowStreamingService"("tvShowId", "streamingServiceId");

-- CreateIndex
CREATE UNIQUE INDEX "Season_tvShowStreamingServiceId_number_key" ON "Season"("tvShowStreamingServiceId", "number");

-- AddForeignKey
ALTER TABLE "TvShowStreamingService" ADD CONSTRAINT "TvShowStreamingService_tvShowId_fkey" FOREIGN KEY ("tvShowId") REFERENCES "TVShow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TvShowStreamingService" ADD CONSTRAINT "TvShowStreamingService_streamingServiceId_fkey" FOREIGN KEY ("streamingServiceId") REFERENCES "StreamingService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_tvShowStreamingServiceId_fkey" FOREIGN KEY ("tvShowStreamingServiceId") REFERENCES "TvShowStreamingService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

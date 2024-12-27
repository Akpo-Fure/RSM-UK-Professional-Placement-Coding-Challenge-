/*
  Warnings:

  - A unique constraint covering the columns `[userId,name,year]` on the table `Film` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Film` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Film" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Film_userId_name_year_key" ON "Film"("userId", "name", "year");

-- AddForeignKey
ALTER TABLE "Film" ADD CONSTRAINT "Film_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

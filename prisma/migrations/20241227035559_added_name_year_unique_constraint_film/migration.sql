/*
  Warnings:

  - A unique constraint covering the columns `[name,year]` on the table `Film` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Film_name_year_key" ON "Film"("name", "year");

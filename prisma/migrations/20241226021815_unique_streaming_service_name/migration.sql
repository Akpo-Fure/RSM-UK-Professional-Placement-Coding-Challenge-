/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `StreamingService` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StreamingService_name_key" ON "StreamingService"("name");

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('GBP', 'USD', 'EUR', 'NGN');

-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('ACTION', 'ADVENTURE', 'COMEDY', 'CRIME', 'DRAMA', 'FANTASY', 'HISTORICAL', 'HORROR', 'MYSTERY', 'PHILOSOPHICAL', 'POLITICAL', 'ROMANCE', 'SAGA', 'SATIRE', 'SCIENCE_FICTION', 'THRILLER', 'URBAN', 'WESTERN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamingService" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'GBP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StreamingService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Film" (
    "id" TEXT NOT NULL,
    "streamingServiceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "genre" "Genre" NOT NULL,
    "rating" INTEGER NOT NULL,
    "runtime" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Film_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Film_streamingServiceId_name_year_key" ON "Film"("streamingServiceId", "name", "year");

-- AddForeignKey
ALTER TABLE "StreamingService" ADD CONSTRAINT "StreamingService_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Film" ADD CONSTRAINT "Film_streamingServiceId_fkey" FOREIGN KEY ("streamingServiceId") REFERENCES "StreamingService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

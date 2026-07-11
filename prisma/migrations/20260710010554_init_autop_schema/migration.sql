/*
  Warnings:

  - You are about to drop the column `adminReply` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `parts` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle` on the `Quote` table. All the data in the column will be lost.
  - The `status` column on the `Quote` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `brand` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientEmail` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientName` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('PENDING', 'TREATED');

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "adminReply",
DROP COLUMN "parts",
DROP COLUMN "price",
DROP COLUMN "userId",
DROP COLUMN "vehicle",
ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "clientEmail" TEXT NOT NULL,
ADD COLUMN     "clientName" TEXT NOT NULL,
ADD COLUMN     "managedById" TEXT,
ADD COLUMN     "model" TEXT NOT NULL,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "photoName" TEXT,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "vin" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "QuoteStatus" NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "AdminProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteItem" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "quoteId" TEXT NOT NULL,

    CONSTRAINT "QuoteItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminProfile_name_key" ON "AdminProfile"("name");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_managedById_fkey" FOREIGN KEY ("managedById") REFERENCES "AdminProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteItem" ADD CONSTRAINT "QuoteItem_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

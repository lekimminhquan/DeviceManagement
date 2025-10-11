/*
  Warnings:

  - You are about to drop the `title_pages` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `meta_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `meta_data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."meta_data" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."title_pages";

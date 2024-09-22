/*
  Warnings:

  - A unique constraint covering the columns `[hostname]` on the table `media` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hostname` to the `media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_selector` to the `media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "media" ADD COLUMN     "hostname" TEXT NOT NULL,
ADD COLUMN     "item_selector" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "media_hostname_key" ON "media"("hostname");

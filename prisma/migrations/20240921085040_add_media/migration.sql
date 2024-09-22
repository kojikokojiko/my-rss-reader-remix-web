-- AlterTable
ALTER TABLE "feeds" ADD COLUMN     "media_id" INTEGER;

-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "feed_title_selector" TEXT NOT NULL,
    "feed_desc_selector" TEXT NOT NULL,
    "item_title_selector" TEXT NOT NULL,
    "item_link_selector" TEXT NOT NULL,
    "item_desc_selector" TEXT NOT NULL,
    "item_pubdate_selector" TEXT NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "feeds" ADD CONSTRAINT "feeds_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

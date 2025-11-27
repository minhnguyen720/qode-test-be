/*
  Warnings:

  - You are about to drop the column `url` on the `Post` table. All the data in the column will be lost.
  - Added the required column `dataBase64` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filename` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimetype` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "url",
ADD COLUMN     "dataBase64" TEXT NOT NULL,
ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "mimetype" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;

/*
  Warnings:

  - You are about to drop the column `dataBase64` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `mimetype` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Post` table. All the data in the column will be lost.
  - Added the required column `url` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "dataBase64",
DROP COLUMN "mimetype",
DROP COLUMN "size",
ADD COLUMN     "url" TEXT NOT NULL;

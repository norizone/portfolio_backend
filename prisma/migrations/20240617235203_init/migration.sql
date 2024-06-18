/*
  Warnings:

  - You are about to drop the column `permission` on the `Work` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `permission` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `viewPermission` to the `Work` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "USER_ROLE" AS ENUM ('LIMIT_VIEWING', 'ALL_VIEWING', 'ADMIN');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "permission",
ADD COLUMN     "permission" "USER_ROLE" NOT NULL;

-- AlterTable
ALTER TABLE "Work" DROP COLUMN "permission",
ADD COLUMN     "linkUrl" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "viewPermission" "USER_ROLE" NOT NULL;

-- DropTable
DROP TABLE "Admin";

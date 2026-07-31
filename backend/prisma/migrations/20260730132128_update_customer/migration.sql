/*
  Warnings:

  - Added the required column `address` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address_number` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth_date` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobile` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rg` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip_code` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `customers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "address" VARCHAR(255) NOT NULL,
ADD COLUMN     "address_number" VARCHAR(20) NOT NULL,
ADD COLUMN     "birth_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "city" VARCHAR(100) NOT NULL,
ADD COLUMN     "complement" VARCHAR(100),
ADD COLUMN     "district" VARCHAR(100) NOT NULL,
ADD COLUMN     "mobile" VARCHAR(20) NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "rg" VARCHAR(20) NOT NULL,
ADD COLUMN     "state" VARCHAR(100) NOT NULL,
ADD COLUMN     "zip_code" VARCHAR(20) NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

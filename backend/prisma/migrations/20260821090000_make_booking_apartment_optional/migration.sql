-- O sistema possui uma única hospedagem; o vínculo com apartamento é opcional.
ALTER TABLE "bookings" ALTER COLUMN "apartment_id" DROP NOT NULL;

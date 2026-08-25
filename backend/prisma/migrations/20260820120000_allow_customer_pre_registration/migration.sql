-- Clientes criados durante o agendamento ainda não possuem os dados do cadastro completo.
ALTER TABLE "customers"
  ALTER COLUMN "rg" DROP NOT NULL,
  ALTER COLUMN "birth_date" DROP NOT NULL,
  ALTER COLUMN "phone" DROP NOT NULL,
  ALTER COLUMN "mobile" DROP NOT NULL,
  ALTER COLUMN "address" DROP NOT NULL,
  ALTER COLUMN "address_number" DROP NOT NULL,
  ALTER COLUMN "district" DROP NOT NULL,
  ALTER COLUMN "city" DROP NOT NULL,
  ALTER COLUMN "state" DROP NOT NULL,
  ALTER COLUMN "zip_code" DROP NOT NULL;

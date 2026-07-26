import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({connectionString});
const prismaCliente = new PrismaClient({ adapter});

export default prismaCliente;
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const prismaClientSingleton = () => {
  // Use the connection string from your .env
  const connectionString = process.env.DATABASE_URL

  // 1. Create the pg Pool
  const pool = new pg.Pool({ connectionString })

  // 2. Create the Adapter
  const adapter = new PrismaPg(pool)

  // 3. Instantiate Prisma with the adapter
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
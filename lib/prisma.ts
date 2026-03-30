import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not defined in environment variables.");
  }

  // Creamos un Pool de pg explícito para controlar las conexiones
  const pool = new Pool({ 
    connectionString: url,
    max: 10, // Limitamos a 10 para evitar saturar Supabase en desarrollo
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  const adapter = new PrismaPg(pool as any);
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  return { client, pool };
}

const { client, pool } = globalForPrisma.prisma && globalForPrisma.pool 
  ? { client: globalForPrisma.prisma, pool: globalForPrisma.pool }
  : createPrismaClient();

export const prisma = client;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = client;
  globalForPrisma.pool = pool;
}

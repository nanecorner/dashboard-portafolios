import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("Creando perfil para Isabel Méndez...");

  const profile = await prisma.profile.upsert({
    where: { slug: "isabel-mendez" },
    update: {},
    create: {
      slug: "isabel-mendez",
      name: "Dra. Isabel Méndez",
      bio: "Especialista en medicina interna y apasionada por la divulgación científica. Este es un perfil de prueba para el nuevo dashboard.",
      quote: "La medicina es el arte de acompañar al paciente en su recuperación.",
      password: "1234",
      themePrimary: "#1e293b",
      themeSecondary: "#3b82f6",
      themeFont: "Inter",
    },
  });

  console.log(`✅ Perfil creado exitosamente con ID: ${profile.id}`);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

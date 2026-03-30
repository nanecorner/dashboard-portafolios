import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("Setting passwords for profiles...");
  
  const count = await prisma.profile.updateMany({
    where: {
      OR: [
        { password: null },
        { password: "" }
      ]
    },
    data: {
      password: "1234"
    }
  });

  console.log(`Updated ${count.count} profiles with password "1234".`);
  await pool.end();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

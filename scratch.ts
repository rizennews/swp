import { db } from "./src/db/index.js";
import { registrations } from "./src/db/schema.js";
import { eq, ilike } from "drizzle-orm";

async function run() {
  const all = await db.query.registrations.findMany();
  console.log("All registrations:", all.map(r => r.fullName));
  
  const matches = await db.query.registrations.findMany({
    where: ilike(registrations.fullName, "%Padmore%"),
  });
  console.log("Matches:", matches);
}

run().catch(console.error).finally(() => process.exit(0));

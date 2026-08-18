import { auth } from "../lib/auth";
import { db } from "../db";
import { user as userSchema } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const args = process.argv.slice(2);
  const email = args[0] || process.env.ADMIN_EMAIL;
  const password = args[1] || "Admin1234!";

  if (!email) {
    console.error("Please provide an email or set ADMIN_EMAIL in .env.local");
    process.exit(1);
  }

  console.log(`Seeding admin user: ${email}`);

  try {
    let user;
    try {
      user = await auth.api.signUpEmail({
        body: {
          email: email,
          password: password,
          name: "Admin",
        },
      });
      console.log("Successfully created user!");
    } catch (e: any) {
      if (e.body?.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
        console.log("User already exists, proceeding to promote to admin...");
      } else {
        throw e;
      }
    }
    
    await db.update(userSchema).set({ role: "admin" }).where(eq(userSchema.email, email));

    console.log("Successfully promoted to Admin role!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

  } catch (error) {
    console.error("Failed to seed admin:", error);
  }
}

main();

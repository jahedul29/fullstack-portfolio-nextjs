// Idempotent admin-seed script.
//
// Standalone ESM script (deliberately does NOT use the `@/` TS path alias or
// the app's Mongoose model) so it can run directly via
// `node --env-file=.env scripts/seed-admin.mjs` with no build step. Talks to
// the `users` collection directly with the driver-level API so the password
// hash matches exactly what the app's User model would produce on `.save()`.
//
// Safe to run against the live DB repeatedly: if a user with ADMIN_EMAIL
// already exists, it logs and exits without writing anything.
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_NAME = "Admin",
  ADMIN_PHONE = "N/A",
  ADMIN_ADDRESS = "N/A",
  BCRYPT_SALT_ROUNDS = "12",
  DATABASE_URL,
} = process.env;

async function main() {
  if (!DATABASE_URL) {
    throw new Error("Missing required environment variable: DATABASE_URL");
  }
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required"
    );
  }

  await mongoose.connect(DATABASE_URL, { bufferCommands: false });

  const users = mongoose.connection.collection("users");

  const existing = await users.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`admin ${ADMIN_EMAIL} already exists, skipping`);
    return;
  }

  const hashedPassword = await bcrypt.hash(
    ADMIN_PASSWORD,
    Number(BCRYPT_SALT_ROUNDS)
  );

  const now = new Date();
  const result = await users.insertOne({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    phoneNumber: ADMIN_PHONE,
    role: "admin",
    password: hashedPassword,
    address: ADMIN_ADDRESS,
    status: "active",
    createdAt: now,
    updatedAt: now,
  });

  console.log(`admin ${ADMIN_EMAIL} created with _id ${result.insertedId}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

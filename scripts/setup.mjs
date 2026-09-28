// Creates .env.local with a random admin password and secret (only if it doesn't exist yet).
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

if (existsSync(".env.local")) {
  console.log("✔ .env.local already exists — nothing to do. Your admin login is in that file.");
  process.exit(0);
}
const password = randomBytes(9).toString("base64url");
const env = readFileSync(".env.example", "utf8")
  .replace(/^AUTH_SECRET=.*$/m, `AUTH_SECRET=${randomBytes(32).toString("hex")}`)
  .replace(/^ADMIN_PASSWORD=.*$/m, `ADMIN_PASSWORD=${password}`)
  .replace(/^NEXT_PUBLIC_SITE_URL=.*$/m, "NEXT_PUBLIC_SITE_URL=http://localhost:3000");
writeFileSync(".env.local", env);
console.log("✔ Created .env.local");
console.log("  Admin login:  info@oynurbouw.nl  /  " + password);
console.log("  Change these (and NEXT_PUBLIC_SITE_URL) in .env.local before going live.");

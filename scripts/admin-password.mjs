#!/usr/bin/env node
// Prints the env vars for /admin. Usage: npm run admin:password   (the password is never stored or logged)
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline/promises";

const rl = createInterface({ input: process.stdin, output: process.stderr });
const password = (await rl.question("Nytt admin-passord (minst 12 tegn): ")).trim();
rl.close();

if (password.length < 12) {
  console.error("Passordet må ha minst 12 tegn.");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
// ":" as separator on purpose: "$" would be expanded as a variable in .env files.
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString("hex")}:${hash.toString("hex")}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString("hex")}`);

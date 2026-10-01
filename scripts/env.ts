// Loads environment variables for scripts the same way Next.js does for the app:
// values in .env.local win over values in .env.
// Import this FIRST in every script, before anything that reads process.env.
import { config } from "dotenv";

config({ path: [".env.local", ".env"], quiet: true });

// Prints the bcrypt hash of a password, e.g. to set a user's password directly in the database.
// Run with: npm run hash-password -- "the-password"
import bcrypt from "bcryptjs";

async function main(){
    const password = process.argv[2];
    if (!password) {
        console.log('Usage: npm run hash-password -- "the-password"');
        process.exit(1);
    }
    const hash = await bcrypt.hash(password, 10);
    console.log(hash);
}

main();

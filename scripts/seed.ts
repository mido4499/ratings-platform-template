// Adds the sample companies from ./data/companies.ts to the database.
// Run with: npm run db:seed
//
// The companies are owned by the admin account (ADMIN_EMAIL in .env), so sign up
// with that email in the app first. Running this twice is safe: existing
// companies (same slug) are left untouched.
import "./env";
import { prisma } from "@/src/lib/db";
import { companies } from "./data/companies";

async function main(){
    const adminUser = await prisma.user.findUnique({where: {email: process.env.ADMIN_EMAIL}})

    if (!adminUser) {
        console.log(`Error - No user found with ADMIN_EMAIL (${process.env.ADMIN_EMAIL}). Sign up in the app with that email first.`);
        return;
    }

    for (const company of companies) {
        await prisma.company.upsert({
            where: {slug: company.slug},
            update: {},
            create: {
                name: company.name,
                slug: company.slug,
                description: company.description,
                status: 'approved',
                userId: adminUser.id,
            }
        });
        console.log(`Done adding ${company.name}`);
    }
    console.log("Complete");
}

main()
    .catch(console.error)
    .finally(()=>prisma.$disconnect())

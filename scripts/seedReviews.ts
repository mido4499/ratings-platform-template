// Adds the sample reviews from ./data/reviews.ts to the companies from ./data/companies.ts.
// Run with: npm run db:seed-reviews   (after npm run db:seed)
//
// Each user can only review a company once, so this creates a few demo
// reviewer accounts (they have no password, so nobody can sign in as them).
// Running this twice is safe: it updates the same reviews instead of duplicating them.
import "./env";
import { prisma } from "@/src/lib/db";
import { companies } from "./data/companies";
import { reviews } from "./data/reviews";

const REVIEWS_PER_COMPANY = 5;

async function getDemoUsers() {
    const users = [];
    for (let i = 1; i <= REVIEWS_PER_COMPANY; i++) {
        const user = await prisma.user.upsert({
            where: { email: `demo-reviewer-${i}@example.com` },
            update: {},
            create: { email: `demo-reviewer-${i}@example.com`, name: `Demo Reviewer ${i}` },
        });
        users.push(user);
    }
    return users;
}

async function main(){
    const demoUsers = await getDemoUsers();

    for (let i = 0; i < companies.length; i++) {
        const company = await prisma.company.findUnique({where: {slug: companies[i].slug}});

        if (!company) {
            console.log(`Skipping ${companies[i].name} - not in the database (run npm run db:seed first).`);
            continue;
        }

        const companyReviews = reviews.slice(i * REVIEWS_PER_COMPANY, (i + 1) * REVIEWS_PER_COMPANY);

        for (let j = 0; j < companyReviews.length; j++) {
            const review = companyReviews[j];
            const userId = demoUsers[j].id;

            await prisma.review.upsert({
                where: { userId_companyId: { userId, companyId: company.id } },
                update: { score: review.score, text: review.text },
                create: { score: review.score, text: review.text, userId, companyId: company.id },
            });
        }
        console.log(`Done adding reviews for ${company.name}..`);
    }
}

main()
    .catch(console.error)
    .finally(()=>prisma.$disconnect())

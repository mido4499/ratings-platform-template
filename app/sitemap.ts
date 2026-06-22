import { prisma } from "@/src/lib/db";

export default async function sitemap() {
    const companies = await prisma.company.findMany({
        where: {status: 'approved'},
        select: { slug: true, createdAt: true}
    })

    const companyUrls = companies.map(company=>({
        url: `https://sisyphusapply.com/companies/${company.slug}`,
        lastModified: company.createdAt,
    }))

    return [
        { url: 'https://sisyphusapply.com', lastModified : new Date()},
        { url: 'https://sisyphusapply.com/companies', lastModified: new Date()},
        ...companyUrls
    ]
}
import type { MetadataRoute } from "next";
import { prisma } from "@/src/lib/db";
import { absoluteUrl } from "@/src/config/site";

// Tells search engines which pages exist. Served at /sitemap.xml
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const companies = await prisma.company.findMany({
        where: {status: 'approved'},
        select: { slug: true, createdAt: true}
    })

    const companyUrls = companies.map(company=>({
        url: absoluteUrl(`/companies/${company.slug}`),
        lastModified: company.createdAt,
    }))

    return [
        { url: absoluteUrl('/'), lastModified : new Date()},
        { url: absoluteUrl('/companies'), lastModified: new Date()},
        ...companyUrls
    ]
}

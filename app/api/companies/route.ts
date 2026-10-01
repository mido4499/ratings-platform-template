// fetch companies or add a company
import {prisma} from "@/src/lib/db";
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { sendAdminNotification } from "@/src/lib/email";
import { averageScore } from "@/src/lib/ratings";
import { siteConfig } from "@/src/config/site";

export async function GET(
    request: NextRequest
)
{
    const search = request.nextUrl.searchParams.get('search');


    const companies = await prisma.company.findMany({
        where: {
            name: {
                contains: search ?? "",
                mode: "insensitive",
            },
            status: 'approved',
        },
        include: {
            reviews: true,
        },
    });

    const companiesWithRatings = companies.map((company) => ({
        ...company,
        averageRating: averageScore(company.reviews),
    }));

    return Response.json(companiesWithRatings);
}

export async function POST(
    request: Request
)
{
    const session = await auth();
    if (!session || !session.user){
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }
    
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';

    // "Acme Corp!" -> "acme-corp". The slug is used in the URL: /companies/acme-corp
    const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/^-+|-+$/g, "");

    if (!slug) {
        return NextResponse.json({error: 'Please enter a name containing letters or numbers.'}, {status: 400});
    }

    const alreadyExists = await prisma.company.findUnique({
        where: {
            slug: slug,
        }
    })

    if (alreadyExists) {
        return Response.json({error: `This ${siteConfig.item.singular.toLowerCase()} already exists`}, {status: 409});
    }

    const company = await prisma.company.create({
        data: {
            name,
            slug: slug,
            description: body.description,
            userId: session.user.id,
            status: "pending",
        },
    });

    // If the email fails, the company is still saved — just log the problem.
    await sendAdminNotification(company.name, session.user.name ?? session.user.email ?? "Unknown").catch(console.error);

    return Response.json(company);
}
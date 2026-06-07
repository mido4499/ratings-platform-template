// fetch companies or add a company
import {prisma} from "@/src/lib/db";
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { sendAdminNotification } from "@/src/lib/email";

export async function GET(
    request: Request
)
{
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search");


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

    const companiesWithRatings = companies.map((company) => {
        const total = company.reviews.reduce(
            (sum, review) => sum + review.score,
            0
        );

        const average = 
            company.reviews.length > 0
            ?
            Math.round(total/company.reviews.length *2)/2
            :0;
        
        return {
            ...company,
            averageRating: average,
        };
    });

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
    const name = body.name;

    const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").trim();

    const company = await prisma.company.create({
        data: {
            name: body.name,
            slug: slug,
            description: body.description,
            userId: session.user.id,
            status: "pending",
        },
    });

    sendAdminNotification(company.name, session.user.name ?? "Unknown");

    return Response.json(company);
}
// route for ratings for a specific company
import {prisma} from "@/src/lib/db";
import { auth } from '@/auth';
import { NextResponse } from "next/server";
import * as BadWords from 'bad-words';
import isInappropriate from "@/src/lib/moderation";

export async function GET(
    request: Request,
    { params } : {params: Promise<{slug: string}>}
)
{
    const { slug } = await params;

    const company = await prisma.company.findUnique({
        where: {
            slug,
        },
    });

    if (!company)
    {
        return new Response("Company not found", {
            status: 404,
        });
    }

    const companyId = company.id;
    const reviews = await prisma.review.findMany({
        where: {
            companyId: companyId,
        },
    });

    

    return Response.json(reviews);
}

export async function POST(
    request: Request,
    { params }: {params: Promise<{slug: string}>}
)
{
    const session = await auth();
    if (!session){
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const userId = session.user.id;

    const body = await request.json();

    try{
        const { slug } = await params;
        console.log(slug);

        const company = await prisma.company.findUnique({
            where: {
                slug,
            },
        });

        if (!company)
        {
            return new Response("Company not found", {
                status: 404,
            });
        }

        const filter = new BadWords.Filter();

        if (filter.isProfane(body.text)) {
            return NextResponse.json({error: 'Your review contains inappropriate language.'}, {status: 400});
        }

        const inappropriate = await isInappropriate(body.text);
        if (inappropriate) {
            return NextResponse.json({error: 'Your review contains inappropriate content.'}, {status: 400})
        }

        const companyId = company.id;

        const review = await prisma.review.create({
            data: {
                score: body.score,
                text: body.text,
                companyId: companyId,
                userId: userId,   // MODIFY THIS AFTER ADDING AUTHENTICATION (done)
            }
        })

        return Response.json(review);
    }
    catch{
        return new Response("Error", {
            status: 500,
        });
    }

    
}
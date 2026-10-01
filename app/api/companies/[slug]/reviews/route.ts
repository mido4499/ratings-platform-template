// route for ratings for a specific company
import {prisma} from "@/src/lib/db";
import { auth } from '@/auth';
import { NextResponse } from "next/server";
import * as BadWords from 'bad-words';
import isInappropriate from "@/src/lib/moderation";
import { isValidScore } from "@/src/lib/ratings";

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
        return NextResponse.json({error: 'Not found'}, {status: 404});
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

        const company = await prisma.company.findUnique({
            where: {
                slug,
            },
        });

        if (!company)
        {
            return NextResponse.json({error: 'Not found'}, {status: 404});
        }

        if (!isValidScore(body.score)) {
            return NextResponse.json({error: 'Please add a minimum of a one-star rating.'}, {status: 400});
        }

        if (typeof body.text !== 'string' || body.text.trim().length == 0) {
            return NextResponse.json({error: 'Please add a review describing your experience.'}, {status: 400});
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

        // Each user can review a company only once (see @@unique in prisma/schema.prisma).
        const existing = await prisma.review.findUnique({
            where: { userId_companyId: { userId, companyId } },
        });
        if (existing) {
            return NextResponse.json({error: 'You have already reviewed this. Edit your existing review instead.'}, {status: 409});
        }

        const review = await prisma.review.create({
            data: {
                score: body.score,
                text: body.text,
                companyId: companyId,
                userId: userId,
            }
        })

        return Response.json(review);
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({error: 'Something went wrong. Please try again.'}, {status: 500});
    }

    
}
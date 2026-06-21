// Get, update, or delete a review
import { prisma } from "@/src/lib/db";
import { auth } from '@/auth';
import { NextResponse } from "next/server";
import * as BadWords from 'bad-words';
import isInappropriate from "@/src/lib/moderation";

export async function GET(
    request: Request,
    {params} : {params: Promise<{reviewId: string}>}
) {
    const { reviewId } = await params;
    const review = await prisma.review.findUnique({
        where: {
            id: reviewId,
        },
        include: {company: true}
    });

    if (!review) {
        return new Response("Rating not found", {
            status: 404,
        });
    }

    return Response.json(review);
}


export async function PUT(
    request: Request,
    {params}: {params: Promise<{reviewId: string}>}
) {
    const session = await auth();
    if (!session){
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const { reviewId } = await params;
    const body = await request.json();

    if (body.text.length == 0) {
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

    try {
        const updatedReview = await prisma.review.update({
            where: {
                id: reviewId,
            },
            data: {
                score: body.score,
                text: body.text,
            },
        });
        return Response.json(updatedReview);
    }
    catch{
        return new Response("Rating not found", {
            status: 404,
        });
    }

}

export async function DELETE(
    request: Request,
    {params}: {params: Promise<{reviewId: string}>}
){
    const session = await auth();
    if (!session){
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const { reviewId } = await params;
    try {
        await prisma.review.delete({
            where: {
                id: reviewId,
            },
        });

        return new Response(null, {
            status: 204,
        });
    }
    catch{
        return new Response("Rating not found", {
            status: 404,
        });
    }
}
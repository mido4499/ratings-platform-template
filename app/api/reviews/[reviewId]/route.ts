// Get, update, or delete a review
import { prisma } from "@/src/lib/db";
import { auth } from '@/auth';
import { NextResponse } from "next/server";
import * as BadWords from 'bad-words';
import isInappropriate from "@/src/lib/moderation";
import { isAdmin } from "@/src/lib/auth";
import { isValidScore } from "@/src/lib/ratings";

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
        return NextResponse.json({error: 'Review not found'}, {status: 404});
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

    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
        return NextResponse.json({error: 'Review not found'}, {status: 404});
    }

    // Only the person who wrote the review may edit it.
    if (review.userId !== session.user.id) {
        return NextResponse.json({error: 'You can only edit your own reviews.'}, {status: 403});
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

export async function DELETE(
    request: Request,
    {params}: {params: Promise<{reviewId: string}>}
){
    const session = await auth();
    if (!session){
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const { reviewId } = await params;

    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
        return NextResponse.json({error: 'Review not found'}, {status: 404});
    }

    // The author or the admin may delete a review.
    if (review.userId !== session.user.id && !isAdmin(session.user.email)) {
        return NextResponse.json({error: 'You can only delete your own reviews.'}, {status: 403});
    }

    await prisma.review.delete({
        where: {
            id: reviewId,
        },
    });

    return new Response(null, {
        status: 204,
    });
}

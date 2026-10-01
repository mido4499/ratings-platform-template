// fetch, update, or delete a company
import {prisma} from "@/src/lib/db";
import { NextResponse } from "next/server";
import { auth } from '@/auth';
import { isAdmin } from "@/src/lib/auth";
import { averageScore } from "@/src/lib/ratings";

export async function GET(
    request: Request,
    { params }: {params: Promise<{slug: string}>}
)
{
    const { slug } = await params;

    const company = await prisma.company.findUnique({
        where: {
            slug,
        },
        // Never send whole user records to the browser — they contain emails and password hashes.
        include: {
            reviews: true,
        }
    });

    if (!company)
    {
        return NextResponse.json({error: 'Not found'}, {status: 404});
    }

    return Response.json({
        ...company,
        averageRating: averageScore(company.reviews).toFixed(1),
    });
}

export async function PUT(
    request: Request,
    { params }: {params: Promise<{slug: string}>}
)
{
    const session = await auth();
    if (!session){
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const { slug } = await params;
    const body = await request.json();

    const company = await prisma.company.findUnique({
        where: {
            slug,
        },
    });

    if (!company)
    {
        return NextResponse.json({error: 'Not found'}, {status: 404});
    }

    // Only the person who added the company, or the admin, may change it.
    if (company.userId !== session.user.id && !isAdmin(session.user.email)) {
        return NextResponse.json({error: 'Forbidden'}, {status: 403});
    }

    const updatedCompany = await prisma.company.update({
        where: {
            id: company.id,
        },
        data: {
            name: body.name,
            description: body.description,
        },
    });

    return Response.json(updatedCompany);
}

export async function DELETE(
    request: Request,
    { params }: {params: Promise<{slug: string}>}
){

    const session = await auth();
    if (!session){
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

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

    // Only the person who added the company, or the admin, may delete it.
    if (company.userId !== session.user.id && !isAdmin(session.user.email)) {
        return NextResponse.json({error: 'Forbidden'}, {status: 403});
    }

    await prisma.company.delete({
        where: {
            id: company.id,
        }
    })
    return new Response(null, {
        status: 204,
    });
}

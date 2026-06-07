// fetch, update, or delete a company
import {prisma} from "@/src/lib/db";
import { NextResponse } from "next/server";
import { auth } from '@/auth';

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
        include: {
            reviews: {
                include: {
                    user: true,
                }
            }
        }
    });

    if (!company)
    {
        return new Response("Company not found", {
            status: 404,
        });
    }

    const total = company.reviews.reduce(
            (sum, review) => sum + review.score,
            0
        );

    const average = 
        company.reviews.length > 0
        ?
        Math.round(total/company.reviews.length *2)/2
        :0;
    
    return Response.json({
        ...company,
        averageRating: average.toFixed(1),
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
    try{
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
        const updatedCompany = await prisma.company.update({
            where: {
                id: companyId,
            },
            data: {
                name: body.name,
                description: body.description,
            },
        });

        return Response.json(updatedCompany);
    }
    catch{
        return new Response("Company not found", {
            status: 404,
        })
    }
    
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

    try {
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
        await prisma.company.delete({
            where: {
                id: companyId,
            }
        })
        return new Response(null, {
            status: 204,
        });
    }  
    catch {
        return new Response("Company not found", {
            status: 404,
        })
    }
}
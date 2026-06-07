import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "./src/lib/db";

export default async function proxy(req: NextRequest){
    const session = await auth();
    const { pathname } = req.nextUrl
    const protectedRoutes = ['/companies/add-company'];

    const isAddReview = /^\/companies\/[^/]+\/add-review$/.test(pathname);
    const isEditReview = /^\/reviews\/[^/]+\/edit/.test(pathname);

    if ((!session) && (protectedRoutes.some(route => pathname.startsWith(route)) || isAddReview || isEditReview)) {
        return NextResponse.redirect(new URL('/sign-in', req.url));

    }else{
        const match = pathname.match(/^\/companies\/([^/]+)/);
        if (match) {
            const slug = match[1];

            const rejected = await prisma.company.findMany({
                where: {
                    status: 'rejected'
                },
                select: {
                    slug: true
                }
            })

            const slugs = rejected.map(company=>company.slug);

            if (slugs.includes(slug) && session?.user?.email !== process.env.ADMIN_EMAIL) return NextResponse.redirect(new URL('/companies', req.url));
        }
    }

    
    


}

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}
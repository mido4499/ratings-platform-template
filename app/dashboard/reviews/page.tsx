import { auth } from "@/auth";
import {prisma} from "@/src/lib/db";
import ReviewsListWithCompany from "@/app/components/ReviewsListWithCompany";
export default async function MyReviewsPage(){
    const session = await auth();

    const reviews = await prisma.review.findMany({
        where: {
            userId: session?.user?.id
        },
        include: {company: true}
        
    });

    return(
        <div className="m-6 min-h-screen">
            <h1 className="text-(--slate) text-2xl mb-4 font-semibold">My Reviews</h1>
            <ReviewsListWithCompany reviews={reviews}/>
        </div>
    )
}
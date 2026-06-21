import { prisma } from "@/src/lib/db";
import EditReviewForm from "@/app/components/EditReviewForm";
import { notFound } from "next/navigation";

export async function generateMetaData({ params }: { params: Promise<{reviewid: string}>}) {
    const { reviewid } = await params;

    const review = await prisma.review.findUnique({
        where: {
            id: reviewid,
        },
        include: {company: true}
    });

    return {
        title: `Be Honest! Edit Review for ${review?.company}`,
        description: `Honestly Editing the rating and review you added for ${review?.company}.`
    }
}

export default async function EditReview({
    params
}: {
    params: Promise<{reviewid: string}>;
}){
    const { reviewid } = await params;

    const review = await prisma.review.findUnique({
        where: {
            id: reviewid,
        },
        include: {company: true}
    });


    if (!review) notFound();

    return(
        <main className="w-full min-h-screen">
            <div className="flex flex-col m-10 md:m-8 items-center gap-4 md:gap-24">
                <h1 className="text-3xl md:text-6xl w-full md:w-4/5 text-(--slate)">
                    Edit your review for {review.company.name}
                </h1>
                <div className="flex flex-col gap-6 w-full md:w-4/5 ">
                    <EditReviewForm
                        review={review}
                    />
                </div>
            </div>

            
        </main>
    )
}
import { prisma } from "@/src/lib/db";
import EditReviewForm from "@/app/components/EditReviewForm";
import { notFound } from "next/navigation";

export default async function EditReview({
    params
}: {
    params: Promise<{reviewid: string}>;
}){
    console.log('YOU HAVE LANDED!!!!');
    const { reviewid } = await params;
    console.log('REVIEW ID---------------->========>>>', reviewid);

    const review = await prisma.review.findUnique({
        where: {
            id: reviewid,
        },
        include: {company: true}
    });

    console.log('REVIEW---------------->========>>>', review);

    if (!review) notFound();

    return(
        <main className="w-full min-h-screen">
            <div className="flex flex-col m-8 items-center gap-24">
                <h1 className="text-6xl w-4/5 text-(--slate)">
                    Edit your review for {review.company.name}
                </h1>
                <div className="flex flex-col gap-6 w-4/5">
                    <EditReviewForm
                        review={review}
                    />
                </div>
            </div>

            
        </main>
    )
}
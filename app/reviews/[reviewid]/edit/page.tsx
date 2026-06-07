import EditReviewForm from "@/app/components/EditReviewForm";
async function getReview(reviewid: string){
    const res = await fetch(
        `http://localhost:3000/api/reviews/${reviewid}`,
        {
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch review");
    }

    return res.json();
}

export default async function EditReview({
    params
}: {
    params: Promise<{reviewid: string}>;
}){
    const { reviewid } = await params;

    const review = await getReview(reviewid);
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
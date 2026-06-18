import { Prisma } from "@prisma/client";

type ReviewWithUser = Prisma.ReviewGetPayload<{include: {user: true}}>;

type ReviewListProps = {
    reviews: ReviewWithUser[];
}

export default function ReviewsListWithCompany({
    reviews
}: ReviewListProps){


    return(
        <div className="flex flex-col gap-6 w-full md:w-3/4">
        {
            reviews.map((review)=>{
                const formattedDate = new Date(review.createdAt).toLocaleDateString(
                    "en-us",
                    {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    }
                );
                return(
                    <div 
                        className="flex flex-col w-full bg-(--sand) gap-2 p-6 rounded-2xl"
                        key={review.id}>
                    <div className="flex">
                        <div className="flex text-6xl bg-(--earth) w-fit h-fit text-(--sand) p-6">
                            {review.score.toFixed(1)}
                        </div>
                        <div className="ml-auto text-(--slate) text-2xl">
                            {formattedDate}
                        </div>
                        
                    </div>
                    
                    <div className="flex p-6 gap-8">
                        <div className="flex flex-col ">
                            <div className="text-(--slate) text-2xl">{review.text}</div>
                        </div>
                        
                        </div>
                    </div>
                )
            })
        }
        </div>
    )
    
    

        
}
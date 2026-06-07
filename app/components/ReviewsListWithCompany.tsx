'use client';
import type { ReviewListWithCompanyProps } from '@/src/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ReviewsList({
    reviews
}: ReviewListWithCompanyProps){
    const router = useRouter();
    async function deleteReview(reviewId: string){
        await fetch(
            `/api/reviews/${reviewId}`,
            {
                method: "DELETE",
                headers: {
                    "content-type": "application/json",
                },
            }
        );
        router.refresh();
    }
    
    return(
        <div className="flex flex-col gap-6 w-3/4">
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
                        
                        <div className='flex mb-4'>
                            <h1 className="text-3xl text-(--slate)">{review.company.name}</h1>
                            <Link href={`/reviews/${review.id}/edit`} className='text-3xl ml-auto'>Edit</Link>
                            <button className='text-3xl ml-4 cursor-pointer text-red-400' onClick={()=>deleteReview(review.id)}>Delete</button>
                        </div>
                        

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
"use client";
import { useState } from "react";
import ReviewInput from "./ReviewInput";
import RatingInput from "./RatingInput";
import { useRouter } from "next/navigation";
import type { Review } from '@/src/lib/types';


export default function ReviewForm({
    review,
}: {
    review: Review;
}){
    const router = useRouter();
    const [reviewText, setReviewText] = useState(review.text);
    const [rating, setRating] = useState(review.score);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(){
        setError("");
        setLoading(true);

        const res = await fetch(
            `/api/reviews/${review.id}`,
            {
                method: "PUT",

                headers: {
                    "content-type": "application/json",
                },

                body: JSON.stringify({
                    score: rating,
                    text: reviewText,
                }),
            }
        );
        const data = await res.json();

        if (!res.ok) {
            setLoading(false);
            setError(data.error);
            return;
        }

        router.push(`/companies/${review.company.slug}`)
    }


    return (
        <div className="flex flex-col gap-8">
            <RatingInput
                rating = {rating}
                onRatingChange={setRating}
            />

            <ReviewInput
                text={reviewText}
                onChangeText={setReviewText}
            />

            <button
                onClick={handleSubmit}
                className="bg-(--slate) text-white text-2xl rounded-2xl w-fit h-20 p-6 ml-auto cursor-pointer"
            >
                {loading ? "Submitting review.." : "Submit"}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    )
}
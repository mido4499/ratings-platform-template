"use client";
import { useState } from "react";
import ReviewInput from "./ReviewInput";
import RatingInput from "./RatingInput";
import { useRouter } from "next/navigation";

export default function ReviewForm({
    slug,
}: {
    slug: string;
}){
    const router = useRouter();
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(0);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(){
        setLoading(true);
        setError("");

        const res = await fetch(
            `/api/companies/${slug}/reviews`,
            {
                method: "POST",

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
            setError(data.error);
            setLoading(false);
            return;
        }

        router.push(`/companies/${slug}`)
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
                {loading ? 'Submitting review..' : 'Submit'}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    )
}
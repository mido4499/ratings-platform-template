"use client";
import Image from "next/image";
import { useState } from "react";

type RatingInputProps = {
    rating: number;
    onRatingChange: (score: number) => void;
}
export default function RatingInput({
    rating,
    onRatingChange,
}: RatingInputProps)
{
    const filledStar = <Image src="/icons/filled_star.svg" alt="filled star" width={48} height={48}/>;
    const hollowStar = <Image src="/icons/hollow_star.svg" alt="filled star" width={48} height={48}/>
    const [hovering, setHovering] = useState(0);

    const labels = {
        1: "Awful",
        2: "Not so good",
        3: "Good",
        4: "So Good",
        5: "Amazing",
    };

    return (
        <div className="flex gap-24 items-center">
            <div className="flex gap-0">
                {[1,2,3,4,5].map((star) => {
                    const filled = (star <= rating) || (star <= hovering);
                    return (
                        <button
                            key={star}
                            type="button"

                            onClick={() => onRatingChange(star)}

                            onMouseEnter={() => setHovering(star)}
                            onMouseLeave={() => setHovering(0)}
                        >
                            {filled?filledStar:hollowStar}
                        </button>
                    )
                })}
            </div>
            

            <p className="text-2xl text-(--slate)"> {labels[(hovering || rating) as keyof typeof labels]} </p> 

        </div>
    )

}
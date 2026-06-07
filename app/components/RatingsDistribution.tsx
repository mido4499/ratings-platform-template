type Review = {
    score: number;
}
type RatingDistributionProps = {
    reviews: Review[];
}

export default function RatingDistribution({
    reviews
}: RatingDistributionProps){
    const distribution = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    };

    reviews.forEach((review: Review) => {
        distribution[
            review.score as keyof typeof distribution
        ]++;
    });

    return(
        <div className="bg-(--sand) rounded-2xl mr-60 w-full flex flex-col gap-6 p-5">
            <h1 className="text-(--earth) text-6xl"> Ratings </h1>
            
            {
                [5,4,3,2,1].map((score) => {
                    const percentage = reviews.length > 0 ? (distribution[score as keyof typeof distribution]/reviews.length) * 100 : 0;
                    return(
                        <div 
                            className="text-(--earth) text-4xl flex gap-4 "
                            key={score}>
                            <p>{score}.0</p>
                            <div className="w-full h-10 border-4 border-(--earth)">
                                <div
                                    className="h-full bg-(--earth)"    
                                    style={{
                                        width: `${percentage}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    )
                })
            }
            
            
            
        </div>
    )
    
}
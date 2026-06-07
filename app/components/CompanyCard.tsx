import Image from "next/image";
type CompanyCardProps = {
    name: string;
    rating: number;
}

export default function CompanyCard({
    name,
    rating
}: CompanyCardProps) {
    const fullStar = <Image src="/icons/filled_star.svg" alt="filled star" width={48} height={48}/>;
    const hollowStar = <Image src="/icons/hollow_star.svg" alt="filled star" width={48} height={48}/>;
    const halfStar = <Image src="/icons/half_filled_star.svg" alt="filled star" width={48} height={48}/>;

    return (
        <div className="bg-(--sand) rounded-3xl p-10 h-60 flex justify-between">
            <div className="flex flex-col justify-between">
                <div className="text-(--slate) text-7xl font-light">
                    {rating == 0? "No ratings":rating.toFixed(1)}
                </div>
                <div className="text-(--slate) text-4xl font-medium">
                    {name}
                </div>
            </div>

            <div className="flex items-end text-purple-400 text-5xl">
                {[1,2,3,4,5].map((score) => {
                    let star;
                    if ((score-rating) == 0.5)
                        star= halfStar
                    else if((score-rating) <= 0)
                        star= fullStar
                    else
                        star= hollowStar

                    return (
                        <div
                            key={score}
                        >
                            {star}
                        </div>
                    )
                })}


            </div>


        </div>
    );
}
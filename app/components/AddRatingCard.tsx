import Image from "next/image"
type Props={
    text: string
}
export default async function AddRatingCard({
    text
}: Props)
{
    return(
        <div className="rounded-3xl w-full bg-(--sand) p-6 flex gap-4">
            <span className="font-bold text-(--slate) text-3xl md:text-6xl">
                {text}
            </span>
            <Image
                src="/icons/rightArrowIcon.svg"
                alt="arrow"
                width={48}
                height={48}
                />
        </div>
    )
}
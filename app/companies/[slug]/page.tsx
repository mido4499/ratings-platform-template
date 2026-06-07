// View each company's info.
import RatingDistribution from "@/app/components/RatingsDistribution";
import ReviewsList from "@/app/components/ReviewsList";
import AddRatingCard from "@/app/components/AddRatingCard";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/db";
import { redirect } from "next/navigation";

async function getCompany(slug: string){
    const res = await fetch(
        `/api/companies/${slug}`,
        {
            cache: "no-store",
        }
    );

    if (!res.ok){
        throw new Error("Failed to fetch company");
    }

    return res.json();
}

export default async function companyPage({
    params
}: {
    params: Promise<{slug: string}>;
}){

    const { slug } = await params;
    const company = await getCompany(slug);

    const session = await auth();
    if (company.status !== 'approved') {
        if (!(session?.user?.id !== company?.userId) && !(session?.user?.email !== process.env.ADMIN_EMAIL)) {
            redirect('/companies');
        }
    }
    if (company.status === 'rejected') {
        redirect('/companies');
    }

    const pending = company.status === 'pending';

    const review = session?.user?.id ? await prisma.review.findUnique({
        where: {
            userId_companyId: {
                userId: session.user.id,
                companyId: company.id,
            }
        }
    }) : null;


    return (
        <main className=" w-full min-h-screen py-8 px-16">
            {pending && (
                <div className="flex gap-4 w-full mb-4 justify-center">
                    <div className="flex gap-2 bg-(--sand) w-fit px-1 py-2 rounded-2xl items-baseline">
                        <span className=" cursor-default text-sm border border-black rounded-full w-4 h-4 flex items-center justify-center">
                            i
                        </span>
                        <p className=" text-sm">Your added company is pending approval. Only you can see it.</p>
                    </div>
                    
                </div>)}
            <div className="flex justify-center">
                <div className="flex w-3/4">
                    <div className="w-1/2 flex flex-col gap-4">
                        <div className="flex items-baseline">
                            <span className="text-(--slate) text-6xl p-1"> {company.averageRating}</span>
                            <span className="text-(--earth) text-2xl">/5.0</span>
                        </div>
                        
                        <p className="text-(--slate) text-1xl ">Based on {company.reviews.length} ratings</p>
                        <h1 className="text-6xl ">{company.name}</h1>
                        <p className="text-(--slate) text-2xl ">{company.description}</p>
                        <div className="w-fit mt-6">
                            {review? (
                                <Link href={`/reviews/${review.id}/edit`}>
                                    <AddRatingCard text="Edit Review"/>
                                </Link>
                            ): (
                                <Link 
                                href={`/companies/${slug}/add-review`}
                                className="block"
                                >
                                    <AddRatingCard text="Add Review"/>
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="ml-auto">
                        <RatingDistribution reviews={company.reviews}/>
                    </div>
                    
                </div>
            </div>
            

            <div className="flex justify-center mt-8">
                <ReviewsList reviews={company.reviews}/>
            </div>
        </main>

    )
}
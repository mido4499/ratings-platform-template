// View each company's info.
import RatingDistribution from "@/app/components/RatingsDistribution";
import ReviewsList from "@/app/components/ReviewsList";
import AddRatingCard from "@/app/components/AddRatingCard";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/db";
import { notFound, redirect } from "next/navigation";

export async function generateMetaData({params}: {params: Promise<{slug: string}>}) {
    const { slug } = await params;
    const company = await prisma.company.findUnique({ where: { slug }} )

    return {
        title: `See reviews for ${company?.name} job applications - Sisyphus Apply`,
        description: `Read honest reviews from real applicants for jobs in ${company?.name}`,
    }
}

export default async function companyPage({
    params
}: {
    params: Promise<{slug: string}>;
}){

    const { slug } = await params;
    const company = await prisma.company.findUnique({
        where: {
            slug,
        },
        include: {
            reviews: {
                include: {
                    user: true,
                }
            }
        }
    });

    if (!company) notFound();

    const total = company.reviews.reduce(
        (sum, review) => sum + review.score,
        0
    );

    const average = company.reviews.length > 0
    ?
    Math.round(total/company.reviews.length *2)/2
    :0;

    const averageRating = average.toFixed(1);

    const session = await auth();
    
    if (company.status !== 'approved') {
        if ((session?.user?.id !== company?.userId) && (session?.user?.email !== process.env.ADMIN_EMAIL)) {
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
        <main className=" w-full min-h-screen py-8 px-8 md:px-16">
            {pending && (
                <div className="flex gap-4 w-full mb-4 justify-center">
                    <div className="flex gap-2 bg-(--sand) w-fit px-1 py-2 rounded-2xl items-baseline">
                        <span className=" cursor-default text-sm border border-black rounded-full w-4 h-4 flex items-center justify-center">
                            i
                        </span>
                        <p className=" text-sm">Your added company is pending approval. Only you can see it.</p>
                    </div>
                    
                </div>)}
            <div className="flex flex-col md:flex-row justify-center">
                <div className="flex flex-col md:flex-row w-full md:w-3/4">
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <div className="flex items-baseline">
                            <span className="text-(--slate) text-6xl p-1"> {averageRating}</span>
                            <span className="text-(--earth) text-2xl">/5.0</span>
                        </div>
                        
                        <p className="text-(--slate) text-1xl ">Based on {company.reviews.length} ratings</p>
                        <h1 className="text-6xl ">{company.name}</h1>
                        <p className="text-(--slate) text-2xl ">{company.description}</p>

                        {/** Mobile Rating Distribution */}
                        <div className="block md:hidden">
                            <RatingDistribution reviews={company.reviews}/>
                        </div>

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
                    <div className="ml-auto hidden md:block">
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
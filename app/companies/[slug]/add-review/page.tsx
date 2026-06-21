// Add a review to a company
import ReviewForm from "@/app/components/ReviewForm";
import { prisma } from "@/src/lib/db";
import { notFound } from "next/navigation";

export async function generateMetaData({params}: {params: Promise<{slug: string}>}) {
    const { slug } = await params;
    const company = await prisma.company.findUnique({ where: { slug }} );

    return {
        title: `Be honest! Add a review for ${company?.name} - Sisyphus Apply`,
        description: `Honestly adding a rating and review for the job application experience for ${company?.name}.`
    }
}

export default async function AddReview({
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

    return(
        <main className="w-full min-h-screen">
            <div className="flex flex-col m-10 md:m-8 items-center gap-4 md:gap-24 mt-6">
                <h1 className="text-3xl md:text-6xl w-full md:w-4/5 text-(--slate)">
                        Add a Review for {company.name}
                </h1>
                <div className="flex flex-col gap-6 w-full md:w-4/5">
                    <ReviewForm
                        slug={slug}
                    />
                </div>
            </div>

            
        </main>
    )
}
// Add a review to a company
import ReviewForm from "@/app/components/ReviewForm";
import { prisma } from "@/src/lib/db";
import { notFound } from "next/navigation";


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
            <div className="flex flex-col m-8 items-center gap-24">
                <h1 className="text-6xl w-4/5">
                        Add a Review for {company.name}
                </h1>
                <div className="flex flex-col gap-6 w-4/5">
                    <ReviewForm
                        slug={slug}
                    />
                </div>
            </div>

            
        </main>
    )
}
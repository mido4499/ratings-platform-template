// Add a review to a company
import ReviewForm from "@/app/components/ReviewForm";

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

export default async function AddReview({
    params
}: {
    params: Promise<{slug: string}>;
}){
    const { slug } = await params;
    const company = await getCompany(slug);


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
// View the list of companies
import Link from "next/link";
import CompanyCard from "../components/CompanyCard";
import { prisma } from "@/src/lib/db";


type Company = {
    id: string;
    slug: string;
    name: string;
    averageRating: number;
}

async function getCompanies(search?: string) {
    const companies = await prisma.company.findMany({
        where: {
            name: {
                contains: search ?? "",
                mode: "insensitive",
            },
            status: 'approved',
        },
        include: {
            reviews: true,
        },
    });

    const companiesWithRatings = companies.map((company) => {
        const total = company.reviews.reduce(
            (sum, review) => sum + review.score,
            0
        );

        const average = 
            company.reviews.length > 0
            ?
            Math.round(total/company.reviews.length *2)/2
            :0;
        
        return {
            ...company,
            averageRating: average,
        };
    });

    return companiesWithRatings;
}

export default async function CompaniesPage({
    searchParams,
}: {
    searchParams: Promise<{search?: string}>;
}) {
    const {search} = await searchParams;
    const companies = await getCompanies(search??'');

    

    return (
        <main className="min-h-screen h-fit flex justify-center ">
            <div className="w-[65%] max-w-5xl p-8 h-full flex flex-col ">

                <h1 className= "text-6xl">
                    Companies
                </h1>

                <div className="space-y-8 pt-8">
                    {companies.map((company: Company) => (
                        <Link
                            key = {company.id}
                            href = {`/companies/${company.slug}`}
                            className="block"
                        >
                            <CompanyCard
                                name={company.name}
                                rating={company.averageRating}
                            />
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-3 text-2xl text-(--slate)">
                    Can&apos;t find what you&apos;re looking for?
                    <Link href={'/companies/add-company'} className="font-bold"> Add your own company </Link>
                </div>
                
            </div>
        </main>
    );
}
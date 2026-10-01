// View the list of companies
import Link from "next/link";
import CompanyCard from "../components/CompanyCard";
import { prisma } from "@/src/lib/db";
import { averageScore } from "@/src/lib/ratings";
import { siteConfig } from "@/src/config/site";

export const metadata = {
    title: siteConfig.item.plural,
}


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

    return companies.map((company) => ({
        ...company,
        averageRating: averageScore(company.reviews),
    }));
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
            <div className="w-full min-h-screen md:w-[65%] max-w-5xl p-8 flex flex-col mt-0">

                <h1 className= "text-3xl md:text-6xl font-semibold">
                    {siteConfig.item.plural}
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

                <div className="text-center mt-auto text-2xl text-(--slate)">
                    Can&apos;t find what you&apos;re looking for?
                    <Link href={'/companies/add-company'} className="font-bold"> Add your own {siteConfig.item.singular.toLowerCase()} </Link>
                </div>
                
            </div>
        </main>
    );
}
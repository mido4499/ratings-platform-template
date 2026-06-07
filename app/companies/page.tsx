// View the list of companies
import Link from "next/link";
import CompanyCard from "../components/CompanyCard";

type Company = {
    id: string;
    slug: string;
    name: string;
    averageRating: number;
}

async function getCompanies(search?: string) {
    const res = await fetch(`/api/companies?search=${search}`, {
        cache: "no-store",
    })

    if (!res.ok)
        throw new Error("Failed to fetch companies.");

    return res.json();
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
'use client';
import type { CompaniesListProps } from "@/src/lib/types";
import Link from "next/link";


export default function CompaniesList({
    companies
}: CompaniesListProps) {

    return (
        <div className="flex flex-col gap-6 w-3/4">
            {
                companies.map((company) => {
                    const status = company.status
                    return(
                        <div
                            className="flex flex-col w-full bg-(--sand) gap-2 p-6 rounded-2xl"
                            key={company.id}
                        >
                                {status==='approved'?(
                                    <div className="flex">
                                        <Link href={`/companies/${company.slug}`} className="text-2xl text-(--slate)">{company.name}</Link>
                                        <p className="text-lg text-(--slate) ml-auto">Status: <span className="text-green-500 text-lg">Approved</span></p>
                                    </div>
                                ):(
                                    status==='pending'?(
                                        <div className="flex">
                                            <Link href={`/companies/${company.slug}`} className="text-2xl text-(--slate)">{company.name}</Link>
                                            <p className="text-lg text-(--slate) ml-auto">Status: <span className="text-blue-500 text-lg">Pending</span></p>
                                        </div>
                                    ):(
                                        <div className="flex">
                                            <p className="text-2xl text-(--slate)">{company.name}</p>
                                            <p className="text-lg text-(--slate) ml-auto">Status: <span className="text-red-500 text-lg">Rejected</span></p>
                                        </div>
                                    )
                                )}
                            
                        </div>
                    )
                })
            }
        </div>
    )
}
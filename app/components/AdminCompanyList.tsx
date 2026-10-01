'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Prisma } from "@prisma/client";
import { siteConfig } from "@/src/config/site";

type CompanyWithUser = Prisma.CompanyGetPayload<{include: {user: true}}>;

type Props= {
    companies: CompanyWithUser[];
}
export default function AdminCompanyList({companies}: Props) {
    const [loading, setLoading] = useState<string|null>(null);
    const [searchCompany, setSearchCompany] = useState("");
    const [removeMessage, setRemoveMessage] = useState("");
    const router = useRouter();

    async function handleDecision(companyid: string, decision: 'approved' | 'rejected') {
        setLoading(companyid);
        await fetch(
            `/api/admin/companies/${companyid}`,
            {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ status: decision }),
            }
        )

        setLoading(null);
        router.refresh();
    }

    // Hides an approved company from the site by marking it as rejected.
    async function removeCompany(slug: string) {
        setRemoveMessage("");
        const res = await fetch(
            `/api/companies/${encodeURIComponent(slug.trim())}`,
            {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            }
        )
        if (!res.ok) {
            setRemoveMessage(`No ${siteConfig.item.singular.toLowerCase()} found with the slug "${slug}".`);
            return;
        }
        const company = await res.json();
        await fetch(
            `/api/admin/companies/${company.id}`,
            {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({status: 'rejected'}),
            }
        )
        setRemoveMessage(`Removed ${company.name}.`);
        setSearchCompany("");
        router.refresh();
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="w-full flex">
                <input
                    type="text"
                    placeholder={`${siteConfig.item.singular} slug to remove (e.g. acme-corp)`}
                    className="rounded bg-white w-1/2"
                    value={searchCompany}
                    onChange={e=>setSearchCompany(e.target.value)}
                />
                <button className="w-1/2" onClick={()=>removeCompany(searchCompany)}>Remove</button>
            </div>
            {removeMessage && <p className="text-sm">{removeMessage}</p>}
            <h1 className="text-3xl text-(--slate)">Pending Requests</h1>
            <div className="flex flex-col gap-2">
                {companies.map((company)=>(
                    <div className="flex flex-col gap-2 mb-4" key={company.id}>
                        <p><strong>{company.name}</strong> submitted by <strong>{company.user.name ?? company.user.email}</strong> on {new Date(company.createdAt).toLocaleDateString()}</p>
                        <p><strong>Description:</strong> {company.description}</p>

                        <div className="flex gap-2">
                            <button
                                onClick={()=> handleDecision(company.id, 'approved')}
                                disabled={loading===company.id}
                                className="bg-green-500 text-white cursor-pointer px-3 py-1 rounded"
                            >
                                {loading===company.id?'Loading...':'Approve'}

                            </button>
                            {loading===company.id ? (''):(
                                <button
                                onClick={()=> handleDecision(company.id, 'rejected')}
                                disabled={loading===company.id}
                                className="bg-red-500 text-white cursor-pointer px-3 py-1 rounded"
                                >
                                    Reject
                                </button>
                            )}
                            
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
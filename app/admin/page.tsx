import { auth } from "@/auth";
import { isAdmin } from "@/src/lib/auth";
import { siteConfig } from "@/src/config/site";
import AdminCompanyList from "../components/AdminCompanyList";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/db";

export default async function AdminPage() {
    const session = await auth();
    if (!isAdmin(session?.user?.email)) {
        redirect('/');
    }
    
    const pending = await prisma.company.findMany({
        where: {status: 'pending'},
        include: {user: true},
        orderBy: {createdAt: 'asc'},
    })

    return(
        <div className="flex flex-col gap-4 ml-6 mt-14">
            {pending.length==0 && <p className="text-2xl text-(--slate)">No pending {siteConfig.item.plural.toLowerCase()}</p>}
            <AdminCompanyList companies={pending}/>
        </div>
    )
}
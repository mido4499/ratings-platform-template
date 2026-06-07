import { auth } from "@/auth";
import AdminCompanyList from "../components/AdminCompanyList";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/db";

export default async function AdminPage() {
    const session = await auth();
    if (session?.user?.email !== process.env.ADMIN_EMAIL) {
        redirect('/');
    }
    
    const pending = await prisma.company.findMany({
        where: {status: 'pending'},
        include: {user: true},
        orderBy: {createdAt: 'asc'},
    })

    return(
        <div className="flex flex-col gap-4 ml-6 mt-14">
            {pending.length==0 && <p className="text-2xl text-(--slate)">No pending companies</p>}
            <AdminCompanyList companies={pending}/>
        </div>
    )
}
import AccountSettings from "@/app/components/AccountSettings";
import { auth } from "@/auth";
import { prisma } from '@/src/lib/db';

export default async function AccountPage(){
    const session = await auth();
    if (!session?.user) return null;

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        }
    })

    if (!user) return null;

    return(
        <div className="m-6 min-h-screen">
            <AccountSettings 
                name={user.name ?? ''} 
                email={user.email} 
                hasPassword={!!user.password}
            />

        </div>
    )
}
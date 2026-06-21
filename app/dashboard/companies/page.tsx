import { auth } from '@/auth';
import { prisma } from '@/src/lib/db';
import Link from 'next/link';
import CompaniesList from '@/app/components/CompaniesList';
import { Company } from "@prisma/client";

export const metadata = {title: 'My Companies - Sisyphus Apply'}

export default async function MyCompaniesPage(){
    const session = await auth();

    const companies: Company[] = await prisma.company.findMany({
        where: {
            userId: session?.user?.id
        }
    });


    return (
        <div className='flex flex-col m-6 min-h-screen gap-6'>
            <h1 className='text-(--slate) text-2xl mb-4 font-semibold'>My Companies</h1>
            <CompaniesList companies={companies}/>
            <Link href={`/companies/add-company`} className='text-(--slate) text-2xl rounded-2xl bg-(--sand) p-4 w-fit'>Add Company</Link>
        </div>
    )
}
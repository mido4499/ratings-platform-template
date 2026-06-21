// Adding a company
import AddCompanyForm from "@/app/components/AddCompanyForm";


export const metadata = {
    title: 'Add Company - Sisyphus Apply',
    description: 'Add a company that you applied to, to help other applicants rate and review its job applications.',
}

export default async function AddCompany(){

    return (
        <main className="w-full min-h-screen">
            <div className="flex flex-col m-8 items-center gap-24">
                <h1 className="text-7xl w-4/5 font-semibold"> Add a company </h1>
                <AddCompanyForm/>
                
            </div>
        </main>
    )
}
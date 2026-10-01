// Adding a company
import AddCompanyForm from "@/app/components/AddCompanyForm";
import { siteConfig } from "@/src/config/site";

const item = siteConfig.item.singular.toLowerCase();

export const metadata = {
    title: `Add ${siteConfig.item.singular}`,
    description: `Add a new ${item} to ${siteConfig.name} so others can rate and review it.`,
}

export default async function AddCompany(){

    return (
        <main className="w-full min-h-screen">
            <div className="flex flex-col m-8 items-center gap-24">
                <h1 className="text-7xl w-4/5 font-semibold"> Add a new {item} </h1>
                <AddCompanyForm/>
                
            </div>
        </main>
    )
}
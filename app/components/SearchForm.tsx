'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchForm(){
    const [search, setSearch] = useState("");
    const router = useRouter();
  
    function handleSearch(e: React.FormEvent){
      e.preventDefault();
  
      router.push(`/companies?search=${search}`);
    }

    return(
        <>
            <h1 className="text-3xl md:text-6xl m-auto text-(--clay)">
                Should <span className="text-(--slate)">Sisyphus not Apply</span> for..
            </h1>
            <form onSubmit={handleSearch} className="flex w-4/5 md:w-3/4 h-13 md:h-15 m-auto gap-2 rounded-2xl bg-(--sand) pt-2 pb-2 pl-2 pr-2">
                <span className="w-2 bg-(--slate)"></span>
                <input
                type="text"
                value={search}
                onChange={(e)=> {
                    setSearch(e.target.value)
                }}
                placeholder="Company you're considering applying for"
                className="text-(--slate) text-xl md:text-3xl w-full outline-none"
                > 
                </input>
            </form>
        </>
    )
}
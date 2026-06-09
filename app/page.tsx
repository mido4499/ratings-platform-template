"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent){
    e.preventDefault();

    router.push(`/companies?search=${search}`);
  }

  return (
    <main className="w-full items-center justify-center flex" style={{ height: 'calc(100vh - 61px)'}}>
      <div className="flex flex-col w-1/2 items-center gap-6 -translate-y-35">
        <Image
          src='/logo.png'
          alt='logo'
          width={300}
          height={200}
          loading="eager"
        />
        <h1 className="text-6xl m-auto text-(--clay)">
          Should <span className="text-(--slate)">Sisyphus Apply</span> for..
        </h1>
        <form onSubmit={handleSearch} className="flex w-3/4 h-15 m-auto gap-2 rounded-2xl bg-(--sand) pt-2 pb-2 pl-2 pr-2">
          <span className="w-2 bg-(--slate)"></span>
          <input
            type="text"
            value={search}
            onChange={(e)=> {
              setSearch(e.target.value)
            }}
            placeholder="Search for a Company.."
            className="text-(--slate) text-3xl w-full outline-none"
          > 
          </input>
        </form>
        
       
      </div>
    </main>
  )
}

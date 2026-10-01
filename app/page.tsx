import Image from "next/image";
import SearchForm from "./components/SearchForm";
import { siteConfig } from "@/src/config/site";

// The home page uses the default title and description from app/layout.tsx

export default function Home() {
  return (
    <main className="w-full items-center justify-center flex" style={{ height: 'calc(100vh - 61px)'}}>
      <div className="flex flex-col w-full md:w-1/2 items-center gap-6 -translate-y-35">
        <Image
          src={siteConfig.images.logo}
          alt={`${siteConfig.name} logo`}
          width={800}
          height={600}
          className="w-1/2 md:w-1/4"
          style={{ height: 'auto'}}
          loading="eager"
        />
        <SearchForm/>
      </div>
    </main>
  )
}

import Image from "next/image";
import SearchForm from "./components/SearchForm";

export const metadata = {
  title: 'Sisyphus Apply - Job Applications Reviews',
  description: `Speak up to unjustified rejection emails! Rate and review your job application
  experience.`
}

export default function Home() {
  return (
    <main className="w-full items-center justify-center flex" style={{ height: 'calc(100vh - 61px)'}}>
      <div className="flex flex-col w-full md:w-1/2 items-center gap-6 -translate-y-35">
        <Image
          src='/logo.png'
          alt='logo'
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

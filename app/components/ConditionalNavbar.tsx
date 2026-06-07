'use client';
import { usePathname } from "next/navigation"; 
import Image from "next/image";
import Link from "next/link";
import NavbarExtras from "./NavbarExtras";
export default function ConditionalNavbar({children} : {children: React.ReactNode}) {
    const pathname = usePathname();

    if (pathname.startsWith('/dashboard') || pathname==='/admin') {
        return(
        <Link className="fixed top-0 right-0 z-50" href='/'>
            <Image
                src='/logo3.png'
                width={100}
                height={100}
                alt='logo'
            />
        </Link>
        )
    }
    return <>{children}</>
}
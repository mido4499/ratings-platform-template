'use client';
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function NavbarExtras() {
    const pathname = usePathname();
    let className="";
    if (pathname==='/') return null;
    if (pathname.startsWith('/dashboard')) className="font-semibold text-lg ml-auto";
    else className="font-semibold text-lg"

    return (
        <Link href="/" className={className}>
                <Image
                    src={'/logo3.png'}
                    width={100}
                    height={100}
                    alt="Home"
                />
        </Link>
    )
}
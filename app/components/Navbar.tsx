'use client';
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";
import Image from "next/image";

export default function Navbar(){
    const { data: session, status} = useSession();
    const loggedInNameOrEmail = session?.user?.name ?? session?.user?.email;
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard') || pathname === '/admin';


    return (
        <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4">
            <div className="flex md:hidden items-center gap-4 mr-4 ml-auto"> {/**For Phone */}
                <UserMenu name={loggedInNameOrEmail ?? ''}/>
            </div>
        
            {isDashboard ? (
                <Link className="hidden md:block fixed top-0 right-0" href='/'> {/**Return only the photo at the far right of the navbar if dashboard. */}
                    <Image
                        src='/logo3.png'
                        width={100}
                        height={100}
                        alt='logo'
                    />
                </Link>
            ):(
                <>  {/**If not dashboard, if not landing page add the photo at the top left and the UserMenu at the top right. If landing, don't include the photo */}
                    {pathname!=='/' && (
                        <Link href="/" className={'font-semibold text-lg hidden md:block'}>
                            <Image
                                src={'/logo3.png'}
                                width={100}
                                height={100}
                                alt="Home"
                            />
                        </Link>
                    )}
                    <div className="hidden md:flex items-center gap-4 mr-4 ml-auto">
                        <UserMenu name={loggedInNameOrEmail ?? ''}/>
                    </div>
                </>
                
            )}

        </nav>
    )
}
// [md]:
// if dashboard: return logo only
// if not dashboard: return the whole navbar

// [sm]:
// return the same nav in any case
import Link from "next/link";
import { auth, signOut } from "@/auth";
import UserMenu from "./UserMenu";
import NavbarExtras from "./NavbarExtras";

export default async function Navbar(){
    const session = await auth();
    return (
        <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4">
            <NavbarExtras/>
            <div className="flex items-center gap-4 mr-4 ml-auto">
                {session?.user ? (
                    <UserMenu name={session.user.name ?? session.user.email as string}/>
                ): (
                    <div className="flex gap-4">
                        <Link href={'/sign-in'}>Sign in</Link>
                        <Link href={'/sign-up'}>Sign up</Link>
                    </div>
                )}
            </div>
        </nav>
    )
}

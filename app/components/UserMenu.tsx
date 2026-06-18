'use client';
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";

type Props={
    name: string;
}
export default function UserMenu({name}: Props){
    const [open, setOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [closing, setClosing] = useState(false); // for mobile
    const ref = useRef<HTMLDivElement>(null); // Getting a ref to the wrapper div element (look at the parent div element in the returned elements)

    const signedOut = name==='';

    useEffect(()=> {   // Renders once when UserMenu is mounted due to the second argument []
        function handleClickOutside(e: MouseEvent) {   // The function that closes the menu when the listener listens to an even of a clicking outside the menu 
            if (ref.current && !ref.current.contains(e.target as Node)) { // Checks that the wrapper div element doesn't contain the mousedown that the even listener listened to
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);  // Adding an event listener to the whole document to close the menu when the user clicks outside 
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [])

    function close() {
        setClosing(true)
        setTimeout(()=> {
            setMobileOpen(false);
            setClosing(false);
        }, 200)
    }


    const links = (
        <>
            <Link
                href={'/dashboard/reviews'}
                onClick={()=>{setOpen(false); close()}}
                className="px-4 py-2 hover:bg-(--clay) text-sm"
            >
                My Reviews
            </Link>
            <Link
                href={'/dashboard/companies'}
                onClick={()=>{setOpen(false); close()}}
                className="px-4 py-2 hover:bg-(--clay) text-sm"
            >
                My Companies
            </Link>
            <Link
                href={'/dashboard/account-settings'}
                onClick={()=>{setOpen(false); close()}}
                className="px-4 py-2 hover:bg-(--clay) text-sm"
            >
                Manage Account
            </Link>
            <button
                onClick={()=>{signOut({callbackUrl: '/'}); close()}}
                className="px-4 py-2 hover:bg-(--clay) text-sm text-left"
            >
                Sign Out
            </button>   
        </>
    )

    const signedOutLinks = (
        <>
            <Link 
                href={'/sign-in'}
                onClick={()=>{setOpen(false); close()}}
                className="px-4 py-2 hover:bg-(--clay) text-sm"
            > 
                Sign in
            </Link>
            <Link 
                href={'/sign-up'}
                onClick={()=>{setOpen(false); close()}}
                className="px-4 py-2 hover:bg-(--clay) text-sm"
            >
                Sign up
            </Link>
        </> 
    )
    return (
        <>
            {/** Desktop Dropdown */}
            <div ref={ref} className="relative hidden md:block">
                <button
                    onClick={()=>setOpen(!open)}
                    className="text-lg cursor-pointer hover:bg-(--clay) p-2 rounded"
                >
                    {name===''?'Add Your Touch':name}
                </button>

                {open && (
                    <div className="absolute right-0 mt-2 w-48 border border-(--earth) rounded flex flex-col">
                        {signedOut ? signedOutLinks : links}
                    </div>
                )}
            </div>

            {/**Mobile Hamgburger */}
            <div className="block md:hidden">
                <button
                    onClick={()=>setMobileOpen(true)}
                    className="cursor-pointer text-2xl"
                >
                    ☰
                </button>
            </div>
{/**MOBILE MENU------------------------------------ */}
            {mobileOpen && (
                <>
                    {/**Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/40 z-9998"
                        onClick={()=>close()}
                    />

                    {/**Sliding Panel */}
                    <div
                        className="fixed top-0 right-0 h-full w-64 bg-(--sand) z-9999 flex flex-col"
                        style={{
                            animation: `${closing ? 'slideOut' : 'slideIn'} 0.2s ease-out`
                        }}
                    >
                        <div className="flex items-center justify-between p-4 border-b">
                            <span className="font-medium">
                                <Link href="/" className={"font-semibold text-lg"} onClick={()=>{close()}}>
                                    <Image
                                        src={'/logo3.png'}
                                        width={100}
                                        height={100}
                                        alt="Home"
                                    />
                                </Link>
                                {name}
                            </span>
                            <span onClick={()=>close()}>x</span>
                        </div>
                        <div className="flex flex-col mt-2">
                            {signedOut ? signedOutLinks : links}
                        </div>
                    </div>
                </>
            )}

            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
            <style>{`
                @keyframes slideOut {
                    from { transform: translateX(0); }
                    to { transform: translateX(100%); }
                }
            `}</style>
        </>
    )
}
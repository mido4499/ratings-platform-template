'use client';
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

type Props={
    name: string;
}
export default function UserMenu({name}: Props){
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null); // Getting a ref to the wrapper div element (look at the parent div element in the returned elements)

    useEffect(()=> {   // Renders once when UserMenu is mounted due to the second argument []
        function handleClickOutside(e: MouseEvent) {   // The function that closes the menu when the listener listens to an even of a clicking outside the menu 
            if (ref.current && !ref.current.contains(e.target as Node)) { // Checks that the wrapper div element doesn't contain the mousedown that the even listener listened to
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);  // Adding an event listener to the whole document to close the menu when the user clicks outside 
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [])

    return (
        <div ref={ref} className="relative">
            <button
                onClick={()=>setOpen(!open)}
                className="text-lg cursor-pointer"
            >
                {name}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 border border-(--earth) rounded flex flex-col">
                    <Link
                        href={'/dashboard/reviews'}
                        onClick={()=>setOpen(false)}
                        className="px-4 py-2 hover:bg-(--clay) text-sm"
                    >
                        My Reviews
                    </Link>
                    <Link
                        href={'/dashboard/companies'}
                        onClick={()=>setOpen(false)}
                        className="px-4 py-2 hover:bg-(--clay) text-sm"
                    >
                        My Companies
                    </Link>
                    <Link
                        href={'/dashboard/account-settings'}
                        onClick={()=>setOpen(false)}
                        className="px-4 py-2 hover:bg-(--clay) text-sm"
                    >
                        Manage Account
                    </Link>
                    <button
                        onClick={()=>signOut({callbackUrl: '/'})}
                        className="px-4 py-2 hover:bg-(--clay) text-sm text-left"
                    >
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    )
}
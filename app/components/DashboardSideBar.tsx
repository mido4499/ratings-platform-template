'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

function subscribe(){return()=>{}}
export default function DashboardSidebar(){
    const pathname = usePathname();
    const mounted = useSyncExternalStore(subscribe, ()=>true, ()=>false); // To only change the className on the client after rendering

    const links = [
        {href: '/dashboard/reviews', label: 'My Reviews'},
        {href: '/dashboard/companies', label: 'My Companies'},
        {href: '/dashboard/account-settings', label: 'My Account'}
    ]

    return (
        <aside className="hidden md:flex flex-col w-64 p-8 border-r border-(--earth) gap-4 min-h-screen ">
            <h2 className="text-(--slate) text-4xl mb-4">Dashboard</h2>
            {links.map(link => (
                <Link key={link.href} href={link.href} className={mounted && pathname==link.href?'font-semibold text-(--slate)':'hover:underline text-(--slate)'}>{link.label}</Link>
            ))}
        </aside>
    )
}
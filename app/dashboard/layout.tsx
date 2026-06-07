import DashboardSidebar from "../components/DashboardSideBar"

export default function DashboardLayout({children}:{children: React.ReactNode}){

    return(
        <div className="flex">
            <DashboardSidebar/>
            <main className="flex-1 mr-30">
                {children}
            </main>
        </div>
        
    )
}
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function Layout() {
    return (
        <div className="min-h-screen bg-[#F5F6FA] text-gray-900 font-sans flex">
            <Sidebar />
            <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 p-6 pb-12 overflow-x-hidden">
                    <div className="w-full h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

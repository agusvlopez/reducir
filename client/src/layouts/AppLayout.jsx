import { BottomNavigation } from "../components/Menu/BottomNavigation";
import { Navbar } from "../components/Menu/Navbar";

export function AppLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <header className="bg-white">
                <Navbar />
            </header>
            <main className="flex-grow container mx-auto pt-[88px] pb-[80px] md:pl-20 md:pb-0">
                {children}
            </main>
            <footer className="bg-white shadow">
                <BottomNavigation />
            </footer>
        </div>
    );
}
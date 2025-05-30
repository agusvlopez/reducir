import { BottomNavigation } from "../components/Menu/BottomNavigation";
import { Navbar } from "../components/Menu/Navbar";

export function AppLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <Navbar />
            </header>
            <main className="flex-grow container mx-auto p-4">
                {children}
            </main>
            <footer className="bg-white shadow mt-4">
                <BottomNavigation />
            </footer>
        </div>
    );
}
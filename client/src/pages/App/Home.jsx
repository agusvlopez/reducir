import { AppLayout } from "../../layouts/AppLayout";

export function Home() {
    return (
        <AppLayout>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-4">Welcome to Reducir</h1>
                <p className="text-lg text-gray-700 mb-8">Your go-to app for reducing carbon footprint.</p>
                <a href="/search" className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
                    Start Reducing
                </a>
            </div>
        </AppLayout>
    );
}
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "../components/Icons/ChevronLeft";

export function EntryAppLayout({ children, footer }) {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Go back to the previous page
    }

    return (
        <div className="flex flex-col min-h-screen bg-dark-green">
            <main className="flex-grow container mx-auto h-[90%] py-[10%] bg-gray-lighter rounded-b-[30px] px-6">
              <button onClick={handleGoBack}>
                  <ChevronLeft 
                      stroke={2}
                      className="size-6 text-dark-green"
                  />
              </button> 
              <section className="mt-6 px-12">
                {children}
              </section>             
            </main>
            <footer className="h-[10vh] flex flex-col items-center justify-center text-off-white">
                {footer}
            </footer>
        </div>
    );
}
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "../components/Icons/ChevronLeft";

export function EntryAppLayout({ children, footer }) {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Go back to the previous page
    }

return (
  <div className="flex flex-col min-h-screen bg-dark-green">
    <main className="flex-grow container mx-auto pt-6 md:pt-8 flex flex-col ">
      
      {/* Header con botón de volver */}
      <div className="px-6 md:px-8 lg:px-12 py-4 md:py-6 ">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={handleGoBack} 
            className="flex items-center gap-2 group cursor-pointer"
            aria-label="Volver"
          >
            <ChevronLeft 
              stroke={2}
              className="size-6 text-white cursor-pointer group-hover:opacity-70 transition-opacity duration-200"
            />
            <span className="text-white text-sm font-medium hidden md:inline group-hover:opacity-70 transition-opacity duration-200">
              Volver
            </span>
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <section className="flex-1 px-8 md:px-8 lg:px-12 pt-10 md:pt-12 bg-white mt-4 rounded-t-[30px]">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </section>
    </main>

    {/* Footer */}
    <footer className="min-h-[10vh] flex flex-col items-center justify-center bg-white py-6 px-4">
      <div className="max-w-7xl mx-auto text-center">
        {footer}
      </div>
    </footer>
  </div>
)
}
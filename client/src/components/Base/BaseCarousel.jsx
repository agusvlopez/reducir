import { useRef, useState, useEffect } from "react";

import { ChevronLeft } from "../Icons/ChevronLeft";
import { ChevronRight } from "../Icons/ChevronRight";

export function BaseCarousel({children}) {
  const scrollRef = useRef(null);

  const [showArrows, setShowArrows] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      const container = scrollRef.current;
      if (container) {
        // Si el ancho del contenido (scrollWidth) es mayor que el ancho visible (clientWidth),
        // significa que hay overflow y necesitamos las flechas.
        setShowArrows(container.scrollWidth > container.clientWidth);
      }
    };

    // Comprobar al montar y al cambiar el tamaño de la ventana
    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    // Limpiar el event listener al desmontar
    return () => window.removeEventListener('resize', checkOverflow);
  }, [children]); // Volver a ejecutar si los hijos cambian

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 280; // Ancho de tarjeta + gap
      const newScrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  }

  return (
      <div className="relative group">
        {showArrows && (
          <>
            {/* Botón izquierdo */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-gradient-to-r from-[#f3f4f6e6] via-[#f3f4f6b3] to-transparent hover:from-[#f3f4f6f2] hover:via-[#f3f4f6cc] hover:to-transparent p-2 pr-2 lg:pr-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer h-[91%] flex items-center justify-start disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6 text-[#005840]" stroke={2} />
            </button>

            {/* Botón derecho */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-gradient-to-l from-[#f3f4f6e6] via-[#f3f4f6b3] to-transparent hover:from-[#f3f4f6f2] hover:via-[#f3f4f6cc] hover:to-transparent p-2 pl-2 lg:pl-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer h-[91%] flex items-center justify-end disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-6 h-6 text-[#005840]" stroke={2} />
            </button>
          </>
        )}

        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 lg:gap-8 lg:pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </div>
      </div>
  );
}
import { useState } from "react";
import { Loader } from "./Loader";

export function Avatar({ src, alt = "Avatar", size = "md" }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const sizes = {
    sm: "w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12",
    md: "w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14",
    lg: "w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20",
    xl: "w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24",
    xxl: "w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32",
  };

  // Fallback local seguro (SVG inline)
  const fallbackAvatar = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23059669'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E`;

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = (e) => {
    console.warn(`Error loading avatar: ${src}`);
    setIsLoading(false);
    setHasError(true);
    
    // Prevenir loop infinito si el fallback también falla
    e.target.onerror = null;
  };

  // Determinar qué imagen mostrar
  const getImageSrc = () => {
    if (hasError) {
      return fallbackAvatar; // SVG inline nunca falla
    }
    if (!src || src === "null" || src === "undefined") {
      return fallbackAvatar;
    }
    return src;
  };

  console.log("src:", src);
  console.log("hasError:", hasError);
  console.log("Final src:", getImageSrc());

  return (
    <div className={`${sizes[size]} rounded-full relative overflow-hidden bg-gray-100`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse" />
      )}
      <img
        src={getImageSrc()}
        alt={alt}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        className={`${sizes[size]} rounded-full object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
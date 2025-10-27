import { useState } from "react";
import { Loader } from "./Loader";

export function Avatar({ src, alt = "Avatar", size = "md" }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    xxl: "w-20 h-20",
  };

  const handleLoad = () => {
    setIsLoading(false);
  }

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  }

  return (
    <div className={`${sizes[size]} rounded-full relative overflow-hidden bg-white`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse" />
      )}
      <img
        src={hasError ? "https://i.pravatar.cc/150" : (src || "https://i.pravatar.cc/150")}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
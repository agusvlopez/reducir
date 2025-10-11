export function Loader({ size = "md", color = "green" }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4"
  };

  const colors = {
    blue: "border-blue-600 border-t-transparent",
    green: "border-dark-green border-t-transparent",
    gray: "border-gray-600 border-t-transparent",
    white: "border-white border-t-transparent"
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`${sizes[size]} ${colors[color]} rounded-full animate-spin my-4 mx-auto`}
      />
    </div>
  );
}

// // Uso:
// // <Loader />
// // <Loader size="lg" color="green" />
// // <Loader size="sm" color="white" />
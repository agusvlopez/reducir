export function Avatar({ src, alt = "Avatar", size = "md" }) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    xxl: "w-20 h-20",
  };

  return (
    <img
      src={src || "https://i.pravatar.cc/150"}
      alt={alt}
      className={`${sizes[size]} rounded-full object-cover`}
    />
  );
}
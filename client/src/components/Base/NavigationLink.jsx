import { Link } from "react-router-dom"

export function NavigationLink({
  label = "Publicación",
  to = "/community",
  variant = "green",
}) {
  const variants = {
    white: "text-[#005840] flex items-center gap-8 text-lg font-semibold",
    green: "text-[#005840] flex items-center gap-8 text-lg font-semibold",
  }
  const className = variants[variant] || variants.default;
  return (
    <Link
        to={to}
        className={className}
    >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        {label}
    </Link>
)}
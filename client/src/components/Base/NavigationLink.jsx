import { Link } from "react-router"

export function NavigationLink({
  label = "Publicación",
  to = "/community"
}) {
  return (
    <Link
        to={to}
        className="text-[#005840] flex items-center gap-8 text-lg font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        {label}
    </Link>
)}
import { Link } from "react-router-dom";

export function CarouselCard({
    actionId,
    title,
    imageSrc,
    imageAlt = "Carousel Image",
    className = ""
}) {
    return (
        <Link to={`/app/actions/${actionId}`}
            className={`w-[118px] h-[180px] lg:w-[230px] lg:h-[300px] rounded-[10px] flex flex-col items-center justify-center bg-[#005840] shadow-md flex-shrink-0 ${className}`}
        >
            <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full object-cover rounded-t-[10px] flex-1"
            />
            <div className="flex items-center justify-between w-full text-[#F5F5F5] p-2 lg:py-4">
                <h3 className="text-xs lg:text-sm line-clamp-2 lg:line-clamp-1">{title}</h3>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </div>
        </Link>
    );
}
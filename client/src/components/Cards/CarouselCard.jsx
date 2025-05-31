export function CarouselCard({
    title,
    imageSrc,
    imageAlt = "Carousel Image",
    className = "",
}) {
    return (
        <div
            className={`w-[118px] h-[150px] rounded-[10px] flex flex-col items-center justify-center bg-[#005840] shadow-md ${className}`}
        >
            <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full object-cover rounded-t-[10px] flex-1"
            />
            <div className="flex items-center justify-between w-full text-[#F5F5F5] p-2">
                <h3 className="text-sm">{title}</h3>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </div>
        </div>
    );
}
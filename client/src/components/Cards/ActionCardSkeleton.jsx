export function ActionCardSkeleton({ className = "" }) {
    return (
        <div
            className={`rounded-[30px] shadow-md border lg:w-[348px] lg:h-[175px] flex items-center justify-around gap-4 p-4 bg-gray-200 animate-pulse ${className}`}
        >
            {/* Skeleton para ImagePill */}
            <div className="flex-none">
                <div className="w-[132px] h-[132px] bg-gray-300 rounded-[30px]"></div>
            </div>

            {/* Skeleton para el contenido de texto */}
            <div className="flex-1 flex flex-col gap-3">
                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>

            {/* Skeleton para el botón de corazón */}
            <div className="w-6 h-6 bg-gray-300 rounded-full self-start"></div>
        </div>
    );
}
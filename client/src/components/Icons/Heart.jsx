import { motion } from 'framer-motion';

export function HeartIcon({
    className = "",
    isFilled = false,
    handleClick,
}) {
    return (
        <motion.div
            className="relative inline-block"
            whileTap={{ scale: 0.8 }}
        >
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isFilled ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`size-6 cursor-pointer ${isFilled ? 'text-[#ED6C1D]' : ''} ${className}`}
                onClick={handleClick}
                animate={isFilled ? {
                    scale: [1, 1.3, 0.9, 1.1, 1],
                } : {}}
                transition={{
                    duration: 0.6,
                    ease: "easeInOut"
                }}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
            </motion.svg>

            {/* Partículas con Framer Motion */}
            {isFilled && (
                <>
                    {[...Array(6)].map((_, i) => (
                        <motion.span
                            key={i}
                            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-[#ED6C1D] rounded-full"
                            initial={{ 
                                opacity: 1, 
                                scale: 0,
                                x: '-50%',
                                y: '-50%'
                            }}
                            animate={{ 
                                opacity: 0, 
                                scale: 1,
                                x: `calc(-50% + ${Math.cos(i * 60 * Math.PI / 180) * 30}px)`,
                                y: `calc(-50% + ${Math.sin(i * 60 * Math.PI / 180) * 30}px)`
                            }}
                            transition={{
                                duration: 0.6,
                                delay: i * 0.05
                            }}
                        />
                    ))}
                </>
            )}
        </motion.div>
    );
}
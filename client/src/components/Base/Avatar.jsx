export function Avatar({
    src,
    alt = "Avatar",
    className = ""
}) {
    return (
        <img
            src={src}
            alt={alt}
            className={`rounded-full w-[77px] h-[77px] object-cover ${className}`}
        />
    );
}
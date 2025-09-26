export function PostContent({
    image,
    content,
    category
}) {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <p>{content}</p>
                <p className="text-sm mt-2"><span className="font-semibold">Categoría:</span> {category}</p>
            </div>

            <img src={image} alt="" className="rounded-[30px]" />
        </div>
    )
}
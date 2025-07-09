export default function BaseInput({
    label,
    inputName,
    inputType = "text",
    inputId,
    inputPlaceholder
}) {
    return (
        <div>
            <label
                htmlFor={inputId}
                className="mb-2 text-xs ml-1"
            >{label}</label>
            <input
                name={inputName}
                type={inputType}
                id={inputId}
                placeholder={inputPlaceholder}
                className="block w-full h-11 rounded-full border-0 py-1.5 pl-4 pr-2 text-[#6D6D6D] text-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            />
        </div>
    )
}
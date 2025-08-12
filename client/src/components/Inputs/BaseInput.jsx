export default function BaseInput({
    label,
    inputName,
    inputType = "text",
    inputId,
    inputPlaceholder,
    inputRequired = false,
    register,
    validationRules = {},
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
                className="block w-full h-11 rounded-full border-0 py-1.5 pl-4 pr-2 text-gray text-sm ring-1 ring-inset ring-gray placeholder:text-gray sm:text-sm sm:leading-6"

                {...register(inputName)}
            />
        </div>
    )
}
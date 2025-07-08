export function BaseTextarea({ className, placeholder, rows = 3, ...props }) {
    return (
        <textarea
          className={`w-full p-4 border border-gray-300 rounded-[30px] focus:outline-none focus:ring-2 focus:ring-[#005840] resize-none ${className}`}
          placeholder={placeholder}
          rows={rows}
          {...props}
        />
    )
}
export function Pill ({ size, text, isActive, onClick, className = '' }) {
  const sizeClasses = {
    default: 'px-4 py-2',
    sm: 'px-2 py-1 text-xs',
  };

  const sizeClass = sizeClasses[size] || sizeClasses.default;

  return (
    <button
      onClick={() => onClick(text)}
      className={`${className} ${sizeClass} rounded-full transition-colors cursor-pointer border-white/30 ${
        isActive
          ? 'bg-white text-[#005840] font-medium'
          : 'bg-[#005840] text-white border hover:bg-white/10 hover:text-[#005840] transition-all'
      }`}
    >
      {text}
    </button>
  );
}
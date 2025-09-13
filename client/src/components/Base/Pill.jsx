// Primero, actualiza tu componente Pill para manejar el estado activo
export function Pill ({ text, isActive, onClick }) {
  return (
    <button
      onClick={() => onClick(text)}
      className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors cursor-pointer border-white/30 ${
        isActive
          ? 'bg-white text-[#005840] font-medium'
          : 'bg-[#005840] text-white border hover:bg-white/10 hover:text-[#005840] transition-all'
      }`}
    >
      {text}
    </button>
  );
}
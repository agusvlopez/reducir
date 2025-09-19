export function ChevronLeft({ className = "", stroke = 1.5 }) {

  return (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" viewBox="0 0 24 24"
    strokeWidth={stroke} 
    stroke="currentColor" 
    className={`${className}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 4.5-7.5 7.5 7.5 7.5" />
    </svg>
  );
}
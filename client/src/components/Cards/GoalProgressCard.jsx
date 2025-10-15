import { Link } from "react-router-dom";
import { DonutProgress } from "../DonutProgress";
import { CarbonIcon } from "../Icons/Carbon";

export function GoalProgressCard({
  targetReductionPercentage,
  baselineValue,      // Valor inicial de carbono en la meta
  targetValue,        // Valor objetivo a alcanzar
  currentCarbon,
  startDate,
  year   // valor actual del carbono
}) {
  //TODO: PASAR ESTA LOGICA A UN HELPER 
  // Calcular el porcentaje de progreso
  const calculateProgress = () => {
    // Cuánto necesita reducir en total
    const totalReductionNeeded = baselineValue - targetValue;
    
    // Cuánto ha reducido hasta ahora
    const currentReduction = baselineValue - currentCarbon;
    
    // Porcentaje de progreso (0-100)
    const progress = Math.min(100, Math.max(0, 
      (currentReduction / totalReductionNeeded) * 100
    ));
    
    return Math.round(progress);
  };

  // Calcular cuánto falta
  const remaining = Math.max(0, currentCarbon - targetValue).toFixed(1);
  
  // Verificar si ya alcanzó la meta
  const goalAchieved = currentCarbon <= targetValue;

  const progressPercentage = calculateProgress();
  
  // 1️⃣ Convertimos las fechas a objetos Date
  const start = new Date(startDate);
  const endOfYear = new Date(year, 11, 31); // mes 11 = diciembre (0-indexed)

  // 2️⃣ Calculamos la diferencia en milisegundos
  const diffMs = endOfYear - start;

  // 3️⃣ Convertimos a días
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return (
    <>
      {goalAchieved && (
          <div className="bg-green-100 p-2 rounded-lg mt-2">
            <p className="text-green-700 font-semibold">¡Meta alcanzada! 🎉</p>
          </div>
      )} 
      <div className="text-xs text-[#383838] flex flex-col gap-1">
        <h3>Objetivo</h3>
        <span className="bg-[#ED6C1D] p-1 px-2 rounded-[30px] text-xs text-white w-fit mb-2">Reducir la huella un {targetReductionPercentage}%</span>

        <div className="flex items-center gap-2 pl-0.5 text-[#005840] font-semibold mb-0.5">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="9" r="9" fill="#005840"/>
          <path d="M9 6V9.75L11.25 12.75" stroke="#F1EDEC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Días restantes: {daysRemaining}</span>
        </div>
        <div className="flex items-center gap-1 text-[#005840] font-semibold">
            <CarbonIcon />
            <span>Reducir {remaining} kg</span>
        </div>
        <Link to={"/app/actions"}
            className="bg-[#005840] text-white py-2 rounded-[30px] flex items-center justify-center mt-2">
            <span>Continuar progreso</span>
            
            <svg className="inline-block ml-2 w-[15px] h-[15px]" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2878_85)">
            <circle cx="7.5" cy="7.5" r="7.5" fill="#F1EDEC"/>
            <path d="M6 5L9 7.5L6 10" stroke="#005840" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_2878_85">
            <rect width="15" height="15" rx="7.5" fill="white"/>
            </clipPath>
            </defs>
            </svg>
        </Link>
    </div>
    <div>
        {/* PROGRESS DONUT */}
        <DonutProgress value={progressPercentage} />
    </div> 
    </>
  )
}
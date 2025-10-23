/**
 * Calcula el porcentaje de progreso hacia la meta de reducción de carbono
 * @param {number} baselineValue - Valor inicial de huella de carbono
 * @param {number} targetValue - Valor objetivo de huella de carbono
 * @param {number} currentCarbon - Valor actual de huella de carbono
 * @returns {number} Porcentaje de progreso (0-100)
 */
export const calculateProgress = (baselineValue, targetValue, currentCarbon) => {
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

/**
 * Calcula cuánto falta para alcanzar la meta
 * @param {number} currentCarbon - Valor actual de huella de carbono
 * @param {number} targetValue - Valor objetivo de huella de carbono
 * @returns {number} Cantidad que falta reducir (siempre positivo)
 */
export const calculateRemaining = (currentCarbon, targetValue) => {
  return Math.max(0, currentCarbon - targetValue);
};

/**
 * Verifica si ya se alcanzó la meta
 * @param {number} currentCarbon - Valor actual de huella de carbono
 * @param {number} targetValue - Valor objetivo de huella de carbono
 * @returns {boolean} True si se alcanzó la meta
 */
export const isGoalAchieved = (currentCarbon, targetValue) => {
  return currentCarbon <= targetValue;
};

/**
 * Calcula los días restantes hasta el fin de año
 * @param {string|Date} startDate - Fecha de inicio
 * @param {number} year - Año objetivo
 * @returns {number} Días restantes hasta el 31 de diciembre
 */
export const calculateDaysRemaining = (startDate, year) => {
  // Convertimos las fechas a objetos Date
  const start = new Date(startDate);
  const endOfYear = new Date(year, 11, 31); // mes 11 = diciembre (0-indexed)

  // Calculamos la diferencia en milisegundos
  const diffMs = endOfYear - start;

  // Convertimos a días
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Obtiene toda la información de progreso de la meta en un solo objeto
 * @param {Object} params - Parámetros
 * @param {number} params.baselineValue - Valor inicial de huella de carbono
 * @param {number} params.targetValue - Valor objetivo de huella de carbono
 * @param {number} params.currentCarbon - Valor actual de huella de carbono
 * @param {string|Date} params.startDate - Fecha de inicio
 * @param {number} params.year - Año objetivo
 * @returns {Object} Objeto con toda la información de progreso
 */
export const getGoalProgressInfo = ({
  baselineValue,
  targetValue,
  currentCarbon,
  startDate,
  year
}) => {
  const progressPercentage = calculateProgress(baselineValue, targetValue, currentCarbon);
  const remaining = calculateRemaining(currentCarbon, targetValue);
  const goalAchieved = isGoalAchieved(currentCarbon, targetValue);
  const daysRemaining = calculateDaysRemaining(startDate, year);

  return {
    progressPercentage,
    remaining: remaining.toFixed(1),
    goalAchieved,
    daysRemaining,
    totalReductionNeeded: baselineValue - targetValue,
    currentReduction: baselineValue - currentCarbon
  };
};
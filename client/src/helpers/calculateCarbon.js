/**
 * Calcula la huella de carbono total sumando las emisiones de consumo eléctrico, transporte y dieta
 * 
 * @description Esta función toma los valores de emisiones de CO2 equivalente de tres categorías principales
 * y devuelve el total combinado. Los valores se convierten a números para asegurar cálculos correctos.
 * 
 * @param {Object} params - Objeto con los parámetros de entrada
 * @param {number|string} params.kwh - Emisiones por consumo eléctrico en kgCO2e
 * @param {number|string} params.transport - Emisiones por transporte en kgCO2e
 * @param {number|string} params.diet - Emisiones por dieta en kgCO2e
 * 
 * @returns {number} Total de emisiones de CO2 equivalente en kgCO2e
 * 
 * @throws {Error} Si algún parámetro no puede convertirse a número válido
 * 
 * @example
 * // Ejemplo básico
 * const result = calculateCarbon({ kwh: 153.6, transport: 50.4, diet: 2500 });
 * // result = 2704
 * 
 * @example 
 * // Con strings que se convierten a números
 * const result = calculateCarbon({ kwh: "76.8", transport: "30.2", diet: "1500" });
 * // result = 1607
 * 
 */
export const calculateCarbon = ({ kwh, transport, diet }) => {
  kwh = parseFloat(kwh);
  transport = parseFloat(transport);
  diet = parseFloat(diet);
  
  if (isNaN(kwh) || isNaN(transport) || isNaN(diet)) {
    throw new Error('Todos los parámetros deben ser números válidos');
  }

  const result = kwh + transport + diet;
  return parseFloat(result.toFixed(2));
}
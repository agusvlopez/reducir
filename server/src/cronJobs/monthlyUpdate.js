import User from "../models/User.js";
import cron from 'node-cron';

// Ejecutar el primer día de cada mes a las 00:01
export const startMonthlyUpdateJob = () => {
  cron.schedule('1 0 1 * *', async () => {
    console.log('🔄 Ejecutando actualización mensual de huellas de carbono...');
    
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      
      // Obtener todos los usuarios activos
      const users = await User.find({ carbonFootprintMonthly: { $exists: true } });
      
      let updatedCount = 0;
      
      for (const user of users) {
        // Verificar si ya tiene el mes actual
        const hasCurrentMonth = user.monthlyFootprints.some(
          entry => entry.month === currentMonth
        );
        
        if (!hasCurrentMonth && user.monthlyFootprints.length > 0) {
          const lastMonth = user.monthlyFootprints[user.monthlyFootprints.length - 1];
          
          // Calcular reducción del mes anterior
          let previousReduction = 0;
          if (user.monthlyFootprints.length > 1) {
            const secondToLast = user.monthlyFootprints[user.monthlyFootprints.length - 2];
            previousReduction = secondToLast.value - lastMonth.value;
          }
          
          await User.findByIdAndUpdate(
            user._id,
            {
              $push: {
                monthlyFootprints: {
                  month: currentMonth,
                  value: user.carbonFootprintMonthly,
                  reduction: 0
                }
              }
            }
          );

          // despues de agregar el nuevo mes, actualizás el anterior
          await User.findByIdAndUpdate(
            user._id,
            {
              $set: {
                [`monthlyFootprints.${user.monthlyFootprints.length - 1}.reduction`]: previousReduction
              }
            }
          );
          
          updatedCount++;
        }
      }
      
      console.log(`✅ Actualización completada: ${updatedCount} usuarios actualizados`);
      
    } catch (error) {
      console.error('❌ Error en actualización mensual:', error);
    }
  });
  
  console.log('📅 Cron job de actualización mensual iniciado');
}

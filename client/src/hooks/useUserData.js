// hooks/useUserData.js (UN SOLO HOOK)
import { useMemo } from 'react';
import { useAuth } from './useAuth';

export const useUserData = () => {
  const { user: userData } = useAuth();
  
  // Helper: verificar si una acción está lograda
  const isActionAchieved = (actionId) => {
    if (!userData?.actions_achieved || !actionId) return false;
    return userData.actions_achieved.some(
      action => action.id === actionId || action.id?.toString() === actionId?.toString()
    );
  };
  
  // Helper: obtener detalles de una acción
  const getActionAchievedDetails = (actionId) => {
    if (!userData?.actions_achieved || !actionId) return null;
    return userData.actions_achieved.find(
      action => action.id === actionId || action.id?.toString() === actionId?.toString()
    );
  };
  
  // Stats memoizadas (solo si las usas frecuentemente)
  const stats = useMemo(() => {
    const actions = userData?.actions_achieved || [];
    
    return {
      totalActions: actions.length,
      totalCo2Reduced: actions.reduce((sum, a) => sum + (a.co2ReductionPerAction * a.progress), 0),
      byFrequency: {
        daily: actions.filter(a => a.frequency === 'daily').length,
        weekly: actions.filter(a => a.frequency === 'weekly').length,
        monthly: actions.filter(a => a.frequency === 'monthly').length,
      }
    };
  }, [userData?.actions_achieved]);
  
  return {
    // Datos raw
    user: userData,
    actionsAchieved: userData?.actions_achieved || [],
    actionsSaved: userData?.actions_saved || [],
    carbonFootprint: {
      yearly: userData?.carbonFootprintYearly || 0,
      monthly: userData?.carbonFootprintMonthly || 0,
    },
    monthlyHistory: userData?.monthlyFootprints || [],
    carbonGoal: userData?.carbonGoal,
    
    // Helpers
    isActionAchieved,
    getActionAchievedDetails,
    
    // Stats (solo si las necesitas)
    stats,
  };
};
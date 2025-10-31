import { useState } from 'react';
import GoalSlider from './GoalSlider/GoalSlider';
import BaseButton from '../Base/BaseButton';

export default function FlipCard({ 
  goalSelectedPercentage = 0,
  goalProgress = 0
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const hasGoal = goalSelectedPercentage > 0;

  // Si no hay meta, solo mostrar card simple sin efecto de giro
  if (!hasGoal) {
    return (
      <div
        className="w-[354px] bg-[#F5F5F5] rounded-[30px] shadow-2xl p-6 flex flex-col justify-between text-dark-green"
      >
        <div>
          <GoalSlider 
          />
        </div>
      </div>
    );
  }

  // Si hay meta, mostrar card con efecto de giro
  return (
    <div className="perspective-1000">
      <div
        className={`relative w-[354px] h-[410px] md:w-[400px] md:h-[450px] transition-transform duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Frente de la card - Meta actual */}
        <div
          className="absolute w-full h-full backface-hidden bg-[#F5F5F5] rounded-[30px] shadow-2xl p-6 md:p-8 flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden' }}
        >
            <div>
              <h2 className="text-xl font-bold mb-2">
                Tu Meta Actual
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Tu meta actual es: <span className='font-semibold'>reducir un {goalSelectedPercentage}% tu huella de carbono</span>
              </p>
              <div className="relative mt-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-dark-green/40 to-dark-green/10 rounded-full flex items-center justify-center shadow-lg">
                  <div className="relative">
                    {/* Icono */}
                    
                    <div className="w-20 h-20 bg-[#005840] rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    
                    <span className="absolute -top-2 -right-2 bg-white text-[#005840] font-bold text-xl px-3 py-1 rounded-full shadow-md border-2 border-[#005840]">
                      -{goalSelectedPercentage}%
                    </span>
                  </div>
                </div>
                {/* Barra de progreso */}
                <div className="mt-2 w-full">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-[#005840]">Progreso</span>
                    <span className="text-sm font-bold text-[#005840]">{goalProgress}%</span>
                  </div>
                  
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-dark-green to-dark-green/50 rounded-full transition-all duration-500 ease-out shadow-sm"
                      style={{ width: `${goalProgress}%` }}
                    >
                      <div className="h-full w-full bg-gradient-to-t from-white/20 to-transparent"></div>
                    </div>
                  </div>
                  
                  {/* Marcadores opcionales */}
                  <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          <BaseButton
            onClick={() => setIsFlipped(!isFlipped)} 
            className='w-full'           
          >
            Cambiar de objetivo
          </BaseButton>
        </div>

        {/* Reverso de la card - Detalles adicionales */}
        <div
          className="absolute w-full h-full backface-hidden bg-[#F5F5F5] rounded-[30px] shadow-2xl p-6 flex flex-col justify-between text-dark-green"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div>
            <GoalSlider 
              isIcon={false}
              title="Cambiar de objetivo" 
            />
          </div>
          
          <BaseButton
            onClick={() => setIsFlipped(!isFlipped)}
            isArray={false}
            className="w-full"
            variant='outlined'
          >
            Ver mi meta actual
          </BaseButton>
        </div>
      </div>
    </div>
  );
}
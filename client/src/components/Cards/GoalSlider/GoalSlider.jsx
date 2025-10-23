import { useGoals } from '../../../hooks/useGoals';
import BaseButton from '../../Base/BaseButton';
import './GoalSlider.css';


export default function GoalSlider({
  isIcon = true,
  title = "Define tu objetivo de reducción"
}) {
  const { sliderValue, setSliderValue, handleSetGoal } = useGoals();

  return (
      <div className="">
        {/* Icono con porcentaje */}
        {isIcon &&
          <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-dark-green/40 to-dark-green/10 rounded-full flex items-center justify-center shadow-lg">
                <div className="relative">
                  {/* Simulación del icono - reemplazar con tu imagen */}
                  
                  <div className="w-20 h-20 bg-[#005840] rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  <span className="absolute -top-2 -right-2 bg-white text-[#005840] font-bold text-xl px-3 py-1 rounded-full shadow-md border-2 border-[#005840]">
                    {sliderValue}%
                  </span>
                </div>
              </div>
          </div>
        }
        
        {/* Título */}
        <h3 className="text-xl font-bold text-[#005840] text-center mb-4">
          {title}
        </h3>
        {!isIcon &&
          <div className="mb-2 flex items-center justify-center font-medium text-sm text-gray">
            Reducir {sliderValue}% de carbono anual
          </div>
        }
        {/* Slider personalizado */}
        <div className="w-full mb-6">
          <div className="relative">
            <input
              type="range"
              min="0"
              max="50"
              value={sliderValue}
              onChange={e => setSliderValue(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider-custom"
              style={{
                background: `linear-gradient(to right, #005840 0%, #005840 ${(sliderValue / 50) * 100}%, #e5e7eb ${(sliderValue / 50) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>
          
          {/* Marcadores */}
          <div className="flex justify-between text-sm font-medium text-gray-500 mt-3 px-1">
            <span className={sliderValue === 0 ? 'text-[#005840]' : ''}>0%</span>
            <span className={sliderValue === 25 ? 'text-[#005840]' : ''}>25%</span>
            <span className={sliderValue === 50 ? 'text-[#005840]' : ''}>50%</span>
          </div>
        </div>

        {/* Mensaje motivacional */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 mb-6 border border-emerald-200">
          <p className="text-sm text-dark-green text-center font-medium">
            {sliderValue === 0 && "¡Comenzá tu camino hacia la sostenibilidad!"}
            {sliderValue > 0 && sliderValue < 25 && "Cada paso cuenta. ¡Seguí adelante!"}
            {sliderValue >= 25 && sliderValue < 50 && "¡Buen comienzo! Tu planeta te lo agradece."}
            {sliderValue === 50 && "¡Excelente compromiso! Vas por buen camino."}
          </p>
        </div>

        {/* Botón */}
        <BaseButton
          onClick={() => handleSetGoal()}
          isArray={false}
          className="w-full"
        >
          Establecer objetivo
        </BaseButton>
      </div>
  );
}
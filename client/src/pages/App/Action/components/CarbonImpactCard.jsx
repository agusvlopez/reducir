import { CarbonIcon } from "../../../../components/Icons/Carbon";

export default function CarbonImpactCard({ carbon, isActionAchieved }) {
    return (
        <div className="bg-white rounded-[30px] shadow-sm p-6 lg:p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#005840]/10 rounded-full flex items-center justify-center">
                    <CarbonIcon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-600 mb-1">
                        {isActionAchieved ? 'Impacto logrado' : 'Impacto potencial'}
                    </p>
                    <p className="text-2xl font-bold text-[#005840]">
                        -{carbon} kg CO₂
                    </p>
                </div>
            </div>
            <p className="text-gray-600 text-sm">
                {isActionAchieved 
                    ? '¡Felicitaciones! Ya redujiste esta cantidad de emisiones.' 
                    : 'Al completar esta acción, reducirás esta cantidad de emisiones.'}
            </p>
        </div>
    );
}
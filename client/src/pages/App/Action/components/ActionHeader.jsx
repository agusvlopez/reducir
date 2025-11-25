import { Heading } from "../../../../components/Base/Heading";
import { ChevronLeft } from "../../../../components/Icons/ChevronLeft";


export default function ActionHeader({ action, onBack }) {
    return (
        <div className="bg-[#005840] text-white rounded-b-[30px] lg:rounded-b-[40px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="flex items-start gap-4 lg:gap-6">
                    <button 
                        onClick={onBack}
                        className="pt-1 flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
                        aria-label="Volver"
                    >
                        <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7" stroke={2} />
                    </button>
                    <div className="flex-1">
                        <Heading 
                            tag="h2" 
                            weight="medium" 
                            align="left" 
                            variant="headline" 
                            className="text-white"
                        >
                            {action.title}
                        </Heading>
                        <p className="text-white/90 text-sm lg:text-base leading-relaxed max-w-3xl">
                            {action.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
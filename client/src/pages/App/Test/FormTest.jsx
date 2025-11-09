import { Heading } from "../../../components/Base/Heading";
import { EntryAppLayout } from "../../../layouts/EntryAppLayout";
import InfoImage from "../../../assets/icons/info.png";
import { Select } from "../../../components/Inputs/Select";
import BaseButton from "../../../components/Base/BaseButton";
import { dietOptions, kwhOptions, transportOptions } from "../../../utils/testOptions";
import { calculateCarbon } from "../../../helpers/calculateCarbon";
import { useCreateCarbonMutation } from "../../../api/apiSlice";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function FormTest() {
  const navigate = useNavigate();

  const { userId } = useAuth();
  const [ createCarbon ] = useCreateCarbonMutation();

  const [isLoading, setIsLoading] = useState(false);

  const handleSendTest = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    const formData = new FormData(event.target);
    const kwh = formData.get("kwh");
    const transport = formData.get("transport");
    const diet = formData.get("diet");

    const carbon = calculateCarbon({ kwh, transport, diet });
    const result = await createCarbon({ userId, carbon }).unwrap();

    if (result.success) {
      navigate(`/app/home/${userId}`);
    }
  }

  return (
    <EntryAppLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto w-full">
          
          {/* Card contenedor */}
          <div className="p-1 sm:p-8 lg:p-12">
            
            {/* Header */}
            <div className="text-center mb-8 lg:mb-10">
              <Heading 
                tag="h1" 
                weight="semibold" 
                color="green"
                className="flex items-center justify-center gap-2"
                size="medium"
              >
                Test Huella de Carbono
                <button 
                  className="hover:opacity-80 transition-opacity"
                  aria-label="Información sobre el test"
                >
                  <img src={InfoImage} alt="" className="w-full" />
                </button>  
              </Heading>
              
              {/* Descripción breve */}
              <p className="text-gray-600 text-sm lg:text-base mt-3 max-w-xl mx-auto">
                Completá estas 3 preguntas para conocer tu impacto ambiental
              </p>
            </div>

            {/* Indicador de progreso */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-[#005840] text-white flex items-center justify-center text-xs font-semibold">
                  1
                </div>
                <span className="text-xs text-gray-600 ml-1 hidden sm:inline">Vivienda</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-[#005840] text-white flex items-center justify-center text-xs font-semibold">
                  2
                </div>
                <span className="text-xs text-gray-600 ml-1 hidden sm:inline">Transporte</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-[#005840] text-white flex items-center justify-center text-xs font-semibold">
                  3
                </div>
                <span className="text-xs text-gray-600 ml-1 hidden sm:inline">Dieta</span>
              </div>
            </div>

            {/* Formulario */}
            <section>
              <p className="text-xs text-gray-500 mb-6 flex items-center gap-1">
                <span className="text-red-500">*</span>
                Indica un campo obligatorio
              </p>
              
              <form 
                onSubmit={handleSendTest}
                className="flex flex-col gap-6 lg:gap-8"
              >
                {/* Pregunta 1 - Vivienda */}
                <div className="bg-gray-50 rounded-[30px] p-5 lg:p-6 border border-gray-200 transition-all hover:border-[#005840]/30">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#005840]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#005840]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <Select
                        selectId="kwh"
                        selectName="kwh"
                        label="Vamos a calcular aproximadamente el consumo de kwh según el tamaño de tu vivienda.*"
                        options={kwhOptions}
                        placeholder="Seleccioná una opción"
                        isRequired
                      />
                    </div>
                  </div>
                </div>

                {/* Pregunta 2 - Transporte */}
                <div className="bg-gray-50 rounded-[30px] p-5 lg:p-6 border border-gray-200 transition-all hover:border-[#005840]/30">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#005840]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#005840]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <Select
                        selectId="transport"
                        selectName="transport"
                        label="¿Qué transporte usas con más frecuencia en tu día a día?*"
                        options={transportOptions}
                        placeholder="Seleccioná una opción"
                        isRequired
                      />
                    </div>
                  </div>
                </div>

                {/* Pregunta 3 - Dieta */}
                <div className="bg-gray-50 rounded-[30px] p-5 lg:p-6 border border-gray-200 transition-all hover:border-[#005840]/30">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#005840]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#005840]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <Select
                        selectId="diet"
                        selectName="diet"
                        label="¿Cuál es tu tipo de dieta?*"
                        options={dietOptions}
                        placeholder="Seleccioná una opción"
                        isRequired
                      />
                    </div>
                  </div>
                </div>

                {/* Botón de envío */}
                <div className="flex flex-col items-center gap-4 mt-4">
                  <BaseButton 
                    buttonType="submit"
                    variant="filled"
                    size="lg"
                    className="w-full sm:w-auto px-12"
                    isLoading={isLoading}
                  >
                    Enviar
                  </BaseButton>
                  
                  {/* Nota de privacidad */}
                  <p className="text-xs text-gray-500 text-center max-w-md">
                    Tus respuestas son confidenciales y se usan únicamente para calcular tu huella de carbono
                  </p>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </EntryAppLayout>
  )
}
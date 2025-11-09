import { useNavigate } from "react-router-dom";
import BaseButton from "../../../components/Base/BaseButton";
import { Heading } from "../../../components/Base/Heading";
import { EntryAppLayout } from "../../../layouts/EntryAppLayout";
import Logo from "../../../assets/logo-md.png";

export function IntroTest() {
  const navigate = useNavigate();

  const handleTestStart = () => {
    navigate("/test/form");
  }
  
  return (
    <EntryAppLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto w-full">
          
          {/* Card contenedor */}
          <div className="rounded-[30px] py-8 lg:p-12">
            
            {/* Contenido centrado */}
            <div className="text-dark-green font-medium flex flex-col gap-6 items-center text-center">
              
              {/* Icono decorativo */}
              <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center mb-2">
                <img src={Logo} alt="Reducir Logo" />
              </div>

              {/* Título */}
              <Heading tag="h1" weight="semibold" color="green" className="text-3xl lg:text-4xl">
                Bienvenido/a
              </Heading>

              {/* Descripción principal */}
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed max-w-2xl">
                <strong className="text-[#005840]">Reducir</strong> fue diseñada para ayudarte a{" "}
                <strong className="text-[#005840]">cambiar tus hábitos</strong>, a ser más amigable con el medio ambiente y también a{" "}
                <strong className="text-[#005840]">reducir la huella de carbono</strong>, que es una forma de medir tu{" "}
                <strong className="text-[#005840]">impacto ambiental</strong>.
              </p>

              {/* Separador visual */}
              <div className="w-16 h-0.5 bg-gray rounded-full my-1"></div>

              {/* Descripción secundaria */}
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed max-w-xl">
                Primero vamos a <strong className="text-dark-green">medir tu huella de carbono</strong> con 3 simples preguntas acerca del transporte y energía.
              </p>

              {/* Características destacadas */}
              <div className="grid grid-cols-3 gap-4 w-full max-w-2xl mt-4">
                <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-[#005840]/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#005840]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">1 minuto</span>
                </div>

                <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-[#005840]/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#005840]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">3 preguntas</span>
                </div>

                <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-[#005840]/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#005840]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Resultados instantáneos</span>
                </div>
              </div>

              {/* Botón de acción */}
              <BaseButton
                onClick={handleTestStart}
                withArrow
                className="mt-2 transform transition-transform hover:scale-105"
                variant="outlined"
                size="lg"
              >
                Iniciar Test
              </BaseButton>

              {/* Nota informativa */}
              <p className="text-xs text-gray-500 mt-4 max-w-md">
                Toda tu información es privada y segura. Usamos estos datos solo para calcular tu huella de carbono personal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </EntryAppLayout>
  )
}
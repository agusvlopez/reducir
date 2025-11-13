import { useState } from 'react';
import questions from '../../../assets/data/questions-test.json';
import BaseButton from '../../../components/Base/BaseButton';
import ButtonLink from '../../../components/Base/ButtonLink';
import { useAuth } from '../../../hooks/useAuth';
import { useCreateCarbonMutation } from '../../../api/apiSlice';

const getCategoryIcon = (category) => {
  const icons = {
    transporte: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    energía: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    alimentación: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
      </svg>
    ),
    residuos: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
    consumo: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    comunidad: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    )
  };
  return icons[category] || null;
};

const categoryInfo = {
  transporte: { label: 'Transporte', color: 'bg-blue-500' },
  energía: { label: 'Energía', color: 'bg-yellow-500' },
  alimentación: { label: 'Alimentación', color: 'bg-green-500' },
  residuos: { label: 'Residuos', color: 'bg-purple-500' },
  consumo: { label: 'Consumo', color: 'bg-pink-500' },
  comunidad: { label: 'Comunidad', color: 'bg-teal-500' }
};

export function FormTest() {
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const { userId } = useAuth();
  const [createCarbon] = useCreateCarbonMutation();

  // Agrupar preguntas por categoría
  const questionsByCategory = questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {});

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateTotal = () => {
    return Object.values(answers).reduce((sum, value) => sum + value, 0);
  };

  const getCompletionPercentage = () => {
    return Math.round((Object.keys(answers).length / questions.length) * 100);
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert('Por favor, respondé todas las preguntas');
      return;
    }

    setIsLoading(true);

    try {
      // Calcular el carbono total sumando todas las respuestas
      const carbonFootprintYearly = calculateTotal();
      const carbonFootprintMonthly = Math.round(carbonFootprintYearly / 12);

      //Aquí deberías descomentar y usar tu lógica real cuando integres:
      const result = await createCarbon({ userId, carbonFootprintYearly, carbonFootprintMonthly }).unwrap();
      if (result.success) {
        setShowResults(true);
        //navigate(`/app/home/${userId}`);
      }
      
      setIsLoading(false);
      setShowResults(true);
    } catch (error) {
      console.error('Error al enviar el test:', error);
      alert('Hubo un error al enviar tus respuestas. Por favor, intentá nuevamente.');
      setIsLoading(false);
    }
  };

  const totalCarbon = calculateTotal();
  const completionPercentage = getCompletionPercentage();

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-[#005840] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-[#005840] mb-4">
            Tu Huella de Carbono
          </h2>
          <div className="text-6xl font-bold text-gray-800 mb-2">
            {totalCarbon}
          </div>
          <p className="text-xl text-gray-600 mb-8">kg CO₂ anuales</p>
          
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <p className="text-gray-700 leading-relaxed">
              {totalCarbon < 5000 && "¡Excelente! Tu huella de carbono es baja. Seguí así y considerá compartir tus hábitos sustentables."}
              {totalCarbon >= 5000 && totalCarbon < 10000 && "Tu huella está en un nivel promedio. Hay oportunidades para reducirla con pequeños cambios en tu día a día."}
              {totalCarbon >= 10000 && "Tu huella de carbono es alta. Te recomendamos revisar tus hábitos de transporte, consumo de energía y alimentación."}
            </p>
          </div>
          <div className="flex flex-col gap-4 items-center">
            <ButtonLink
              to={`/app/home/${userId}`}
              >
                Empezar a reducir mi huella
              </ButtonLink>
            <BaseButton
              variant='outlined'
              onClick={() => {
                setShowResults(false);
                setAnswers({});
              }}
            >
              Hacer el test nuevamente
            </BaseButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#005840] mb-3">
            Test Huella de Carbono
          </h1>
          <p className="text-gray-600 text-sm lg:text-base max-w-2xl mx-auto">
            Respondé estas preguntas para conocer tu impacto ambiental anual
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="bg-white rounded-full shadow-md p-2 mb-8">
          <div className="flex items-center justify-between mb-2 px-4">
            <span className="text-sm font-semibold text-gray-700">
              Progreso: {Object.keys(answers).length}/{questions.length}
            </span>
            <span className="text-sm font-semibold text-[#005840]">
              {completionPercentage}%
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#005840] transition-all duration-300 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Preguntas */}
        <div className="space-y-8">
          {Object.entries(questionsByCategory).map(([category, categoryQuestions]) => {
            const categoryData = categoryInfo[category] || { label: category, color: 'bg-gray-500' };
            
            return (
              <div key={category} className="bg-white rounded-3xl shadow-lg p-6 lg:p-8">
                {/* Header de categoría */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <div className={`w-12 h-12 ${categoryData.color} rounded-full flex items-center justify-center text-white`}>
                    {getCategoryIcon(category)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 capitalize">
                    {categoryData.label}
                  </h3>
                </div>

                {/* Preguntas */}
                <div className="space-y-6">
                  {categoryQuestions.map((question) => (
                    <div key={question.id} className="space-y-3">
                      <label className="block text-gray-700 font-medium">
                        {question.question}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      
                      <div className="space-y-2">
                        {question.options.map((option, index) => (
                          <label
                            key={index}
                            className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                              answers[question.id] === option.value
                                ? 'border-[#005840] bg-[#005840]/5'
                                : 'border-gray-200 hover:border-[#005840]/30 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={option.value}
                              checked={answers[question.id] === option.value}
                              onChange={() => handleAnswerChange(question.id, option.value)}
                              className="w-5 h-5 text-[#005840] focus:ring-[#005840]"
                            />
                            <span className="flex-1 text-gray-700">{option.text}</span>
                            {answers[question.id] === option.value && (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#005840]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                              </svg>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón de envío */}
        <div className="flex flex-col items-center gap-4 pt-8">
          <BaseButton
            onClick={handleSubmit}
            disabled={isLoading || Object.keys(answers).length < questions.length}
            size='lg'
          >
            {isLoading ? 'Calculando...' : 'Ver mi resultado'}
          </BaseButton>
          
          <p className="text-xs text-gray-500 text-center max-w-md">
            Tus respuestas son confidenciales y se usan únicamente para calcular tu huella de carbono
          </p>
        </div>
      </div>
    </div>
  );
}
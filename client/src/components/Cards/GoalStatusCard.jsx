import ButtonLink from '../Base/ButtonLink';
import { Heading } from '../Base/Heading';
import { GoalProgressCard } from './GoalProgressCard';


export default function GoalStatusCard({ userData, isOwnProfile = true }) {
  const isInactive = userData?.carbonGoal?.status === 'inactive';
  const hasCarbon = userData?.carbon > 0;

  return (
    <div className="w-[354px] md:w-[400px] h-fit mx-auto mt-[-70px] bg-[#F5F5F5] rounded-[30px] shadow-lg p-4 ">
      {isInactive && isOwnProfile ? (
        hasCarbon ? (
          <div className="flex flex-col items-center text-center">
            <Heading
              tag="h3"
              variant="headline"
              size="small"
              color="green"
              weight="semibold"
              align="center"
              className="mb-4 leading-snug"
            >
              Establecé una <strong>meta anual</strong> para generar un <strong>gran cambio</strong> en el <strong>planeta</strong>.
            </Heading>

            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Tus acciones ya están reduciendo tu huella.  
              <strong> ¡Definí un objetivo</strong> para mantenerte motivado y ver tu progreso!
            </p>

            <ButtonLink to="/app/emissions/goals" className="mx-auto">
              Establecer meta
            </ButtonLink>
          </div>
        ) : (
          <>
            <Heading
              tag="h3"
              variant="headline"
              size="small"
              color="green"
              weight="semibold"
              align="center"
              className="mb-3 leading-snug"
            >
              ¿Ya hiciste el test para medir tu huella de carbono anual?
            </Heading>

            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Con este dato, va a ser mucho más divertido usar <strong>reducir</strong>,  
              ya que podrás ver cómo tus acciones bajan tu huella a lo largo del año.
            </p>

            <ButtonLink to="/test/intro" className="mx-auto">
              Realizar test
            </ButtonLink>
          </>
        )
      ) : (
          <GoalProgressCard
            targetReductionPercentage={userData?.carbonGoal?.targetReductionPercentage}
            baselineValue={userData?.carbonGoal?.baselineValue}
            targetValue={userData?.carbonGoal?.targetValue}
            currentCarbon={userData?.carbon}
            startDate={userData?.carbonGoal?.startDate}
            year={userData?.carbonGoal?.year}
            isOwnProgress={isOwnProfile}
          />
      )}
    </div>
  );
}

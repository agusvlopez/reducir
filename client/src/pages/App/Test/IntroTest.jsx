import { useNavigate } from "react-router-dom";
import BaseButton from "../../../components/Base/BaseButton";
import { Heading } from "../../../components/Base/Heading";
import { EntryAppLayout } from "../../../layouts/EntryAppLayout";

export function IntroTest() {
  const navigate = useNavigate();

  const handleTestStart = () => {
    navigate("/test/form");
  }
  
  return (
    <EntryAppLayout>
      <div className="text-dark-green font-medium flex flex-col gap-6">
        <Heading tag="h1" weight="semibold" color="green">
          Bienvenido/a
        </Heading>
        <p>
          <strong>Reducir</strong> fue diseñada para ayudarte a <strong>cambiar hábitos</strong> a más beneficiosos con el medio ambiente y tambien <strong>reducir la huella de carbono</strong>, que es una forma de medir tu <strong>impacto ambiental</strong>.
        </p>
        <p>
          Primero vamos a <strong>medir tu huella de carbono</strong> con 3 simples preguntas acerca del transporte y energía.
        </p>
        <BaseButton
          onClick={handleTestStart}
        className={"flex self-center mt-4"}>
          Iniciar Test
        </BaseButton>
      </div>
    </EntryAppLayout>
  );
}
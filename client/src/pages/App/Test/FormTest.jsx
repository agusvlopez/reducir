import { Heading } from "../../../components/Base/Heading";
import { EntryAppLayout } from "../../../layouts/EntryAppLayout";
import InfoImage from "../../../assets/icons/info.png";
import BaseInput from "../../../components/Inputs/BaseInput";
import { Select } from "../../../components/Inputs/Select";
import BaseButton from "../../../components/Base/BaseButton";
import { dietOptions, kwhOptions, transportOptions } from "../../../utils/testOptions";
import { calculateCarbon } from "../../../helpers/calculateCarbon";
import { useCreateCarbonMutation } from "../../../api/apiSlice";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function FormTest() {
  const navigate = useNavigate();

  const [ createCarbon ] = useCreateCarbonMutation();
  const { userId } = useAuth();

  const handleSendTest = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const kwh = formData.get("kwh");
    const transport = formData.get("transport");
    const diet = formData.get("diet");

    const carbon = calculateCarbon({ kwh, transport, diet });
    const result = await createCarbon({ userId, carbon }).unwrap();

    if (result.success) {
      navigate('/app/home');
    }
  }

  return (
    <EntryAppLayout>
      <Heading 
      tag="h1" 
      weight="semibold" 
      color="green"
      >
        <span className="">
          Test Huella de Carbono
          <button className="ml-2">
           <img src={InfoImage} alt=""/>
          </button>  
        </span>
      </Heading>
      <section className="mt-6">
        <p>(*) Indica un campo obligatorio</p>
        <form 
        onSubmit={handleSendTest}
        className="flex flex-col gap-9 mt-6">
          <Select
            selectId="kwh"
            selectName="kwh"
            label="Vamos a calcular aproximadamente el consumo de kwh según el tamaño de tu vivienda.*"
            options={kwhOptions}
            placeholder="Seleccioná una opción"
            isRequired
          />
          <Select
            selectId="transport"
            selectName="transport"
            label="¿Qué transporte usas con más frecuencia en tu día a día?*"
            options={transportOptions}
            placeholder="Seleccioná una opción"
            isRequired
          />
          <Select
            selectId="diet"
            selectName="diet"
            label="¿Cuál es tu tipo de dieta?*"
            options={dietOptions}
            placeholder="Seleccioná una opción"
            isRequired
          />
          <BaseButton 
            buttonType="submit"
            isButton={false}
            className="self-center mt-4 px-8"
          >
            Enviar
          </BaseButton>
        </form>
      </section>
    </EntryAppLayout>
  );
}
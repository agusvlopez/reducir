import { Heading } from "../../../components/Base/Heading";
import { EntryAppLayout } from "../../../layouts/EntryAppLayout";
import InfoImage from "../../../assets/icons/info.png";
import BaseInput from "../../../components/Inputs/BaseInput";
import { Select } from "../../../components/Inputs/Select";
import BaseButton from "../../../components/Base/BaseButton";

const housingOptions = [
  { value: "casa", label: "Casa" },
  { value: "departamento", label: "Departamento" },
];

const transportOptions = [
  { value: "auto", label: "Auto" },
  { value: "autobus", label: "Autobus" },
  { value: "tren", label: "Tren" },
  { value: "bicicleta", label: "Bicicleta" },
  { value: "caminar", label: "Caminar" },
];

const dietOptions = [
  { value: "carnivoro", label: "Carnívoro" },
  { value: "vegetariano", label: "Vegetariano" },
  { value: "vegano", label: "Vegano" },
];

export function FormTest() {
  const handleSendTest = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const housing = formData.get("housing");
    const transport = formData.get("transport");
    const diet = formData.get("diet");
    // Fetch or API call to send the test data
    console.log("Test enviado:", { housing, transport, diet });
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
            selectId="housing"
            selectName="housing"
            label="Vamos a calcular aproximadamente el consumo de kwh según el tamaño de tu vivienda.*"
            options={housingOptions}
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
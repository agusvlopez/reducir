import { Heading } from "../../components/Base/Heading";
import BaseInput from "../../components/Inputs/BaseInput";
import BaseButton from "../../components/Base/BaseButton";
import { ChevronLeft } from "../../components/Icons/ChevronLeft";
import { EntryAppLayout } from "../../layouts/EntryAppLayout";
import { Link } from "react-router";

export function Register() {

    const handleRegister = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");
        // Fetch or API call to register the user
        if (password !== confirmPassword) {
            console.log("Las contraseñas no coinciden");
            // Handle error, e.g., show a message to the user
            return;
        }

        console.log("Registro:", { name, email, password, confirmPassword });
    }

    return (
        <EntryAppLayout 
            footer={
                <p className="text-sm">
                    ¿Ya tenés una cuenta? <Link to="/login" className="font-semibold underline">Iniciar sesión</Link>
                </p>
            }
        >
                <Heading 
                    tag="h1" 
                    weight="semibold"
                    color="green"
                >Registrarse</Heading>

                <form 
                className="flex flex-col gap-6 mt-6"
                onSubmit={handleRegister}>
                    <BaseInput 
                    label="Nombre"
                    inputName="name"
                    inputType="text"
                    inputId="name"
                    inputPlaceholder="Ingresá tu nombre"
                    inputRequired
                    />
                    <BaseInput 
                    label="Email"
                    inputName="email"
                    inputType="email"
                    inputId="email"
                    inputPlaceholder="Ingresá tu email"
                    inputRequired
                    />
                    <BaseInput 
                    label="Contraseña"
                    inputName="password"
                    inputType="password"
                    inputId="password"
                    inputPlaceholder="Contraseña"
                    inputRequired
                    />
                    <BaseInput 
                    label="Confirmar contraseña"
                    inputName="confirmPassword"
                    inputType="password"
                    inputId="confirmPassword"
                    inputPlaceholder="Confirmar contraseña"
                    inputRequired
                    />
                    <BaseButton 
                        type="submit"
                        className="flex self-center mt-[6px]"
                    >Registrarse</BaseButton>
                </form>
        </EntryAppLayout>
    );
}
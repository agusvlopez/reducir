import { Heading } from "../../components/Base/Heading";
import BaseInput from "../../components/Inputs/BaseInput";
import BaseButton from "../../components/Base/BaseButton";
import { ChevronLeft } from "../../components/Icons/ChevronLeft";
import { EntryAppLayout } from "../../layouts/EntryAppLayout";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function Register() {
    const { handleRegister } = useAuth();


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
                    label="Nombre de usuario"
                    inputName="username"
                    inputType="text"
                    inputId="username"
                    inputPlaceholder="Ingresá tu nombre de usuario"
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
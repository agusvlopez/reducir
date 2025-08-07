import { Heading } from "../../components/Base/Heading";
import BaseInput from "../../components/Inputs/BaseInput";
import BaseButton from "../../components/Base/BaseButton";
import { EntryAppLayout } from "../../layouts/EntryAppLayout";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";


export function Login() {
    const { handleLogin } = useAuth();

    return (
        <EntryAppLayout 
            footer={
                <p className="text-sm">
                    ¿No tenés una cuenta? <Link to="/register" className="font-semibold underline">Registrarse</Link>
                </p>
            }
        >
                <Heading 
                    tag="h1" 
                    weight="semibold"
                    color="green"
                >Iniciar sesión</Heading>

                <form 
                className="flex flex-col gap-6 mt-6"
                onSubmit={handleLogin}>
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
                    <div className="flex justify-end">
                        {/* TODO: LINK PARA RECUPERAR CONTRASEÑA */}
                        <p className="text-sm text-gray font-semibold">¿Olvidaste tu contraseña?</p>
                    </div>
                    <BaseButton 
                        type="submit"
                        className="flex self-center mt-[6px]"
                    >Iniciar sesión</BaseButton>
                </form>
        </EntryAppLayout>
    );
}
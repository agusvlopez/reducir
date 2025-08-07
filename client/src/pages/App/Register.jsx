import { Heading } from "../../components/Base/Heading";
import BaseInput from "../../components/Inputs/BaseInput";
import BaseButton from "../../components/Base/BaseButton";
import { ChevronLeft } from "../../components/Icons/ChevronLeft";
import { EntryAppLayout } from "../../layouts/EntryAppLayout";
import { Link } from "react-router-dom";
import { useCreateUserMutation } from "../../api/apiSlice";

export function Register() {
    const [createUser] = useCreateUserMutation();
    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get("name");
        const username = formData.get("username");
        const email = formData.get("email");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");
        // Fetch or API call to register the user
        if (password !== confirmPassword) {
            console.log("Las contraseñas no coinciden");
            // Handle error, e.g., show a message to the user
            return;
        }

        // Call the createUser mutation with the new user data
        try {
            // Call the createUser mutation with the credentials
            const response = await createUser({ 
                name,
                username,
                email,
                password
            });
            console.log("Respuesta del create:", response);
            // Handle access token in secure storage or state management
            console.log("accesstoken:", response.data?.accessToken);
            // Handle successful login, e.g., redirect to dashboard or show success message
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            // Handle error, e.g., show a message to the user
        }

        console.log("Registro:", { name, username, email, password, confirmPassword });
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
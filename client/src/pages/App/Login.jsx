import { Heading } from "../../components/Base/Heading";
import BaseInput from "../../components/Inputs/BaseInput";
import BaseButton from "../../components/Base/BaseButton";
import { EntryAppLayout } from "../../layouts/EntryAppLayout";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userLoginSchema } from "../../utils/formSchemas";


export function Login() {
    const { handleLogin } = useAuth();

    // React hook form
    const { 
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(userLoginSchema)
    });

    const onSubmit = handleSubmit((data) => {
        handleLogin(data);
    });

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
                className="flex flex-col mt-4"
                onSubmit={onSubmit}>
                    <div className="h-[92px]">
                        <BaseInput 
                            label="Email"
                            inputName="email"
                            inputType="email"
                            inputId="email"
                            inputPlaceholder="Ingresá tu email"
                            register={register}
                        />
                        {errors?.email && <span className="text-red-500 text-xs font-medium">{errors.email?.message}</span>}
                    </div>
                    <div className="h-[92px]">
                        <BaseInput 
                            label="Contraseña"
                            inputName="password"
                            inputType="password"
                            inputId="password"
                            inputPlaceholder="Contraseña"
                            register={register}
                        />
                        {errors?.password && <span className="text-red-500 text-xs font-medium">{errors.password?.message}</span>}
                    </div>
                    <div className="flex justify-end">
                        {/* TODO: LINK PARA RECUPERAR CONTRASEÑA */}
                        <p className="text-sm text-gray font-semibold">¿Olvidaste tu contraseña?</p>
                    </div>
                    <BaseButton 
                        type="submit"
                        className="flex self-center mt-6"
                    >Iniciar sesión</BaseButton>
                </form>
        </EntryAppLayout>
    );
}
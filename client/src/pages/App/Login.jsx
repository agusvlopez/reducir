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

                <div className="border-t border-gray pt-[10%] mt-[15%] flex items-center justify-center gap-4">
                    <a 
                    href="http://localhost:3000/auth/google"
                    className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray font-semibold rounded-[30px] border border-gray-300 hover:bg-gray-50 hover:shadow-lg transition-all duration-200 shadow-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Iniciar sesión con Google
                    </a>
                </div>
        </EntryAppLayout>
    );
}
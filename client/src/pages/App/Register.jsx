import { Heading } from "../../components/Base/Heading";
import BaseInput from "../../components/Inputs/BaseInput";
import BaseButton from "../../components/Base/BaseButton";
import { EntryAppLayout } from "../../layouts/EntryAppLayout";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userRegisterSchema } from "../../utils/formSchemas";


export function Register() {
    const { handleRegister } = useAuth();

    // React hook form
    const { 
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(userRegisterSchema)
    });
    
    const onSubmit = handleSubmit((data) => {
        handleRegister(data);
    });

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
                className="flex flex-col mt-4"
                onSubmit={onSubmit}>
                    <div className="h-[92px]">
                        <BaseInput 
                            label="Nombre"
                            inputName="name"
                            inputType="text"
                            inputId="name"
                            inputPlaceholder="Ingresá tu nombre"
                            register={register}

                        />
                        {errors?.name && <span className="text-red-500 text-xs font-medium">{errors.name?.message}</span>}
                    </div>
                    <div className="h-[92px]">
                        <BaseInput 
                            label="Nombre de usuario"
                            inputName="username"
                            inputType="text"
                            inputId="username"
                            inputPlaceholder="Ingresá tu nombre de usuario"
                            
                            register={register}
                        />
                        {errors.username && <span className="text-red-500 text-xs font-medium">{errors.username?.message}</span>}
                    </div>
                    <div className="h-[92px]">
                        <BaseInput 
                            label="Email"
                            inputName="email"
                            inputType="email"
                            inputId="email"
                            inputPlaceholder="Ingresá tu email"
                            
                            register={register}
                        />
                        {errors.email && <span className="text-red-500 text-xs font-medium">{errors.email.message}</span>}
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
                        {errors.password && <span className="text-red-500 text-xs font-medium">{errors.password?.message}</span>}
                    </div>
                    <div className="h-[92px]">
                        <BaseInput 
                            label="Confirmar contraseña"
                            inputName="confirmPassword"
                            inputType="password"
                            inputId="confirmPassword"
                            inputPlaceholder="Confirmar contraseña"
                            
                            register={register}
                        />
                        {errors.confirmPassword && <span className="text-red-500 text-xs font-medium">{errors.confirmPassword?.message}</span>}
                    </div>
                    <BaseButton 
                        type="submit"
                        className="flex self-center mt-6"
                    >Registrarse</BaseButton>
                </form>
        </EntryAppLayout>
    );
}
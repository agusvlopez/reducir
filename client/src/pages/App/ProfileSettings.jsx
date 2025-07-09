import { Avatar } from "../../components/Base/Avatar";
import { Heading } from "../../components/Base/Heading";
import editIcon from "../../assets/icons/edit.png";
import BaseInput from "../../components/Inputs/BaseInput";
import BaseButton from "../../components/Base/BaseButton";

export function ProfileSettings() {
  return (
    <section className="h-screen bg-[#005840] py-6">
    <div className="flex items-center gap-6 mb-8 px-6">
      <Heading tag="h1" size="h2" weight="semibold" align="left" color="white">Ajustes del perfil</Heading>
    </div>

     <div className="bg-[#F5F5F5] rounded-t-[30px] p-6 pb-20 flex flex-col gap-8">
      <div className="relative w-fit mx-auto mt-4 flex flex-col items-center gap-8">
        <Avatar 
          src="https://i.pravatar.cc/300"
          alt="Avatar de usuario"
          size="lg"
        />
        <button className="w-6 h-6 p-1 inline-block rounded-full bg-[#F1EDEC] shadow-xl absolute -top-1 -right-1 cursor-pointer">
          <img src={editIcon} alt="Editar" className="w-full h-full object-contain" />
        </button>
      </div>
      <div>
        <form className="flex flex-col gap-6">
          <BaseInput 
            label="Nombre"
            inputName="name"
            inputType="text"
            placeholder="Tu nombre"
            className="mb-4"
          />
          <BaseInput 
            label="Correo electrónico"
            inputName="email"
            inputType="email"
            placeholder="Tu correo electrónico"
            className="mb-4"
          />
          <div className="flex self-end justify-end">
            <BaseButton
              type="submit"
            >
              Guardar cambios
            </BaseButton>
          </div>
        </form>
      </div>
      {/* line */}
      <span className="h-[1px] w-full bg-[#6D6D6D] mx-auto"></span>
      <div className="flex flex-col gap-4">
        <Heading tag="h2" size="h3" weight="semibold" align="left" color="green">Cambiar contraseña</Heading>
        <form className="flex flex-col gap-6" action="">
          <BaseInput 
            label="Nueva contraseña"
            inputName="newPassword"
            inputType="password"
            placeholder="Tu nueva contraseña"
            className="mb-4"
          />
          <div className="flex self-end justify-end">
            <BaseButton
              type="submit"
            >
              Cambiar contraseña
            </BaseButton>
          </div>
        </form>
      </div>
      {/* line */}
      <span className="h-[1px] w-full bg-[#6D6D6D] mx-auto"></span>
      <div className="flex flex-col gap-4 mb-4">
        <BaseButton
          className="w-full"
          variant="outline">
          Cerrar sesión
        </BaseButton>
          <BaseButton
          className="w-full">
          Eliminar cuenta
        </BaseButton>
      </div>
     </div>
    </section>
  )
}
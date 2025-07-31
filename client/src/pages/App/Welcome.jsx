
import { useNavigate } from "react-router";
import Logo from "../../assets/logo-md.png";
import BaseButton from "../../components/Base/BaseButton";

export function Welcome() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Go to the login page
    navigate("/login");
  };

  const handleRegister = () => {
    // Go to the registration page
    navigate("/register");
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-gray-lighter">
      <img src={Logo} alt="Logo" className="w-32 mx-auto mt-10" />
      <div className="w-[177px] flex flex-col gap-4 mt-10">
        <BaseButton
          onClick={handleLogin}
          className="w-full h-[42px]">Iniciar sesión</BaseButton>
        <BaseButton
          onClick={handleRegister}
          variant="white" 
          className="w-full h-[42px]">Registrarse</BaseButton>
      </div>
    </div>
  )
}
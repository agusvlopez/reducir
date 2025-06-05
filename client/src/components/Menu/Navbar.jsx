import { Link } from "react-router";
import LogoText from "../../assets/logo-text.png";
import HamburgerMenu from "../../assets/icons/menu/hamburger1.png";
import CloseIcon from "../../assets/icons/menu/close.png";
import { useState } from "react";

export function Navbar() {
    const [isCloseIconVisible, setIsCloseIconVisible] = useState(false);

    const toggleMenu = () => {
        setIsCloseIconVisible(!isCloseIconVisible);
    };

    return (
        <div className="fixed z-20 top-0 left-0 right-0 bg-white shadow-md">
            <nav className="flex justify-between items-center p-4 py-6">
                <Link to="/home" className="text-gray-700 hover:text-blue-500">
                    <img src={LogoText} alt="Home" />
                </Link>
                <button onClick={toggleMenu} className="transition duration-300 ease-in-out">
                    {isCloseIconVisible ? (
                        <img src={CloseIcon} alt="Close" className="block" />
                    ) : (
                        <img src={HamburgerMenu} alt="Menu" className="block" />
                    )}
                </button>
            </nav>
            {isCloseIconVisible && (
                <div className="absolute top-16 left-0 right-0 bg-white shadow-md p-4">
                    <ul className="flex flex-col space-y-2">
                        <li>
                            <Link to="/home" className="text-gray-700 hover:text-blue-500">Ajustes del perfil</Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
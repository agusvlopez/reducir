import { Link } from "react-router";
import HomeIcon from "../../assets/icons/menu/home.png";
import ActionsIcon from "../../assets/icons/menu/actions.png";
import EmissionsIcon from "../../assets/icons/menu/emissions.png";
import CommunityIcon from "../../assets/icons/menu/community.png";

export function BottomNavigation() {
    return (
        <div className="fixed z-20 bottom-0 left-0 right-0 bg-white shadow-md">
            <nav className="flex justify-around p-4">
                <Link to="/home" className="">
                    <img src={HomeIcon} alt="Home" />
                </Link>
                <Link to="/actions" className="">
                    <img src={ActionsIcon} alt="Acciones" />
                </Link>
                <Link to="/emissions" className="">
                    <img src={EmissionsIcon} alt="Emisiones" />
                </Link>
                <Link to="/community" className="">
                    <img src={CommunityIcon} alt="Comunidad" />
                </Link>
            </nav>
        </div>
    );
}
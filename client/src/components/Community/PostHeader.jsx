import { Link } from "react-router-dom";
import { Avatar } from "../Base/Avatar";

export function PostHeader({
    userId,
    name,
    username,
    profileImage
}) {
    return (
        <div>
            <Link className="flex items-center gap-4" to={`/app/home/${userId}`}>
                <Avatar src={profileImage} />
                <div className={`flex flex-col gap-1 mb-2 text-sm`}>
                    <span className="font-semibold">{name}</span>
                    <span className="">@{username}</span>
                </div>
            </Link>
        </div>
    )
}
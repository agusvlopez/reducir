import { Avatar } from "../Base/Avatar";

export function PostHeader({
    name,
    username,
    profileImage
}) {
    return (
        <div className="flex items-center gap-4">
            <Avatar src={profileImage} />
            <div className={`flex flex-col gap-1 mb-2 text-sm`}>
                <span className="font-semibold">{name}</span>
                <span className="">@{username}</span>
            </div>
        </div>
    )
}
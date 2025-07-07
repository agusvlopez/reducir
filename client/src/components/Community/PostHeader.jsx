import { Avatar } from "../Base/Avatar";

export function PostHeader() {
    return (
        <div className="flex items-center gap-4">
            <Avatar src="https://i.pravatar.cc/300" />
            <div className={`flex flex-col gap-1 mb-2 text-sm`}>
                <span className="font-semibold">Nombre usuario</span>
                <span className="">@nombredeusuario</span>
            </div>
        </div>
    )
}
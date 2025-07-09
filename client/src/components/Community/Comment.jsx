import { Avatar } from "../Base/Avatar";
import { CommentHeart } from "./CommentHeart";

export function Comment({
    answers
}) {
    console.log("answers", answers);

    return (
        <>
            <div className="flex flex-col gap-4 border-b border-[#6D6D6D] pb-6">
                <div className="flex justify-between gap-4">
                    <div>
                        <Avatar
                            src="https://i.pravatar.cc/300"
                        />
                        {answers &&
                            // line
                            <span className="h-1/3 w-[2px] block mx-auto bg-[#6D6D6D] mt-2"></span>
                        }
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <div>
                            <div className="flex items-center gap-1">
                                <span>Nombre usuario</span>
                                <span>@nombredeusuario</span>
                            </div>
                            <p>Acá va el comentario</p>
                        </div>
                        <div className="text-[#6D6D6D]">
                            <CommentHeart />
                        </div>
                    </div>
                </div>

                {answers?.map(answer => (
                    <div key={answer.id} className="flex justify-between gap-4">
                        <Avatar src="https://i.pravatar.cc/300" />
                        <div className="flex-1 flex flex-col gap-2">
                            <div>
                                <div className="flex items-center gap-1">
                                    <span>{answer?.name}</span>
                                    <span>{answer?.username}</span>
                                </div>
                                <p>{answer?.comment}</p>
                            </div>
                            <div className="text-[#6D6D6D]">
                                <CommentHeart />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
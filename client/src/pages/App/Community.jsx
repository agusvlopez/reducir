import { useState } from "react";
import { Avatar } from "../../components/Base/Avatar";
import { Heading } from "../../components/Base/Heading";
import { Post } from "../../components/Community/Post";
import { Search } from "../../components/Inputs/Search";
import { Select } from "../../components/Inputs/Select";
import { BaseButton } from "../../components/Base/BaseButton";

export function Community() {
    const [isNewPost, setIsNewPost] = useState(false);

    const handleAddPost = () => {
        setIsNewPost(true);
    };
    return (
        <section className="h-screen bg-[#005840] py-6">
            <div className="flex items-center gap-6 mb-8 px-6">
                <Avatar
                    src="https://www.gravatar.com/avatar/"
                    alt="User Avatar"
                    size="sm"
                    isBordered={true}
                    className="mx-auto"
                />

                <Search className="flex-1" />
            </div>

            <div className="bg-[#F5F5F5] rounded-t-[30px] p-6 pb-20">
                <button
                    onClick={handleAddPost}
                    className="flex items-center gap-[10px] font-semibold mb-8 text-[#005840]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Compartir un nuevo logro
                </button>
                {isNewPost && (
                    <div className="py-8">
                        <div className="flex items-center gap-4 mb-4">
                            {/* form */}
                            <Avatar
                                src="https://i.pravatar.cc/300"
                                size="sm"
                                isBordered={true} />
                            <Select />
                        </div>
                        <textarea
                            className="w-full h-24 p-4 text-sm border border-gray-300 rounded-[30px] focus:outline-none focus:ring-2 bg-[#F1EDEC] text-[#383838] shadow-sm"
                            placeholder="Escribí algo sobre tu logro..."
                        />
                        <div className="flex justify-end mt-4">
                            <BaseButton
                                onClick={() => setIsNewPost(false)}
                                color="green">
                                Publicar
                            </BaseButton>
                        </div>

                    </div>
                )}

                <div className="flex flex-col gap-6">
                    <Post />
                    <Post />
                </div>
            </div>
        </section >
    );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NewPostModal } from "../Community/NewPostModal";
import { usePosts } from "../../hooks/usePosts";
import { CATEGORIES } from "../../constants/categories";

export function AchievementCard({
    actionId,
    title,
    imageSrc,
    imageAlt = "Achievement Image",
    className = "",
    onNavigate
}) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isSharedOpen, setIsSharedOpen] = useState(false);

  const { addPost } = usePosts();

    const handleShare = (e) => {
      e.preventDefault();
      e.stopPropagation();

      setIsSharedOpen(true);
    }

    const handleAddPost = async (...args) => {
      const success = await addPost(...args);
      if (success) {
        navigate("/app/community");
      }
    }

    const handleCardClick = () => {
      if (onNavigate && !isHovered) {
        onNavigate(actionId);
      }
    }

    return (
      <>
      {isSharedOpen && (
        <NewPostModal 
          isOpen={isSharedOpen}
          onClose={() => setIsSharedOpen(false)}
          onSubmit={handleAddPost}
          categories={CATEGORIES}
          actionSelectedId={actionId}
        />
      )}
      <div 
            onClick={handleCardClick}
            className={`w-[118px] h-[180px] lg:w-[230px] lg:h-[300px] rounded-[10px] flex flex-col items-center justify-center bg-[#005840] shadow-md flex-shrink-0 relative overflow-hidden cursor-pointer ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full object-cover rounded-t-[10px] flex-1"
            />
            
            <div className="flex items-center justify-between w-full text-[#F5F5F5] p-2 lg:py-4">
                <h3 className="text-xs lg:text-sm line-clamp-2 lg:line-clamp-1">{title}</h3>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </div>

            {/* Overlay con fondo blanco e iconos centrados */}
            <div 
                className={`absolute inset-0 bg-white flex flex-col lg:flex-row w-full items-center justify-center gap-6 lg:gap-8 transition-opacity duration-300 rounded-[10px] ${
                    isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
                {/* Icono de compartir */}
                <Link 
                    onClick={handleShare}
                    className="flex items-center justify-center p-2 hover:scale-110 transition-transform text-[#005840] cursor-pointer"
                    aria-label="Compartir"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 lg:w-8 lg:h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                    </svg>
                </Link>
                
                {/* Icono de ver */}
                <Link to={`/app/actions/${actionId}`}
                    className="flex items-center justify-center p-2 hover:scale-110 transition-transform text-[#005840] cursor-pointer"
                    aria-label="Ver"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 lg:w-8 lg:h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </Link>
            </div>
        </div>
      </>
    );
}
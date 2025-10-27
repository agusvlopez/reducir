import { Answer } from "./Answer";

export function PostModal({ isOpen, onClose, handleComment, srcAvatar, isPostLoading }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 z-40 animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-[30px] shadow-xl max-w-md w-full animate-[slideUp_0.2s_ease-out]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Escribir comentario</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-[30px] transition-colors"
            >
              {/* CLOSE ICON */}
              <span className="text-gray-500 cursor-pointer hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </span>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* TODO: VER SI ANSWER FUNCIONA (CHEQUEAR A QUE URI HACE LA PETICION), SI NO, CREAR COMPONENTE NUEVO */}
            <Answer 
              onSubmit={handleComment}
              isLoading={isPostLoading}
              srcAvatar={srcAvatar}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
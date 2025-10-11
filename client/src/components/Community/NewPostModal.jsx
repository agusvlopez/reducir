import { Avatar } from "../Base/Avatar";
import BaseButton from "../Base/BaseButton";
import { Select } from "../Inputs/Select";

export function NewPostModal({ isOpen, onClose, onSubmit, categories }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
    onClose();
  };

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
          className="bg-white rounded-[30px] shadow-xl max-w-lg w-full animate-[slideUp_0.2s_ease-out]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-dark">Nueva Publicación</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar
                src="https://i.pravatar.cc/300"
                size="lg"
                isBordered={true} 
              />
              <Select
                selectId="category"
                selectName="category"
                label="Categoría"
                options={categories}
                placeholder="Categoría"
                isRequired
              />
            </div>
            
            <textarea
              name="content"
              id="content"
              rows="4"
              className="w-full h-24 p-4 text-sm border border-gray-300 rounded-[30px] focus:outline-none focus:ring-2 bg-[#F1EDEC] text-[#383838] shadow-sm"
              placeholder="Escribí algo sobre tu logro..."
            />
            
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
              >
                Cancelar
              </button>
              <BaseButton
                type="submit"
                color="green"
              >
                Publicar
              </BaseButton>
            </div>
          </form>
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
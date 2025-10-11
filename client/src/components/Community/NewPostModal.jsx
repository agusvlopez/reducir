import { useState } from "react";
import { Avatar } from "../Base/Avatar";
import BaseButton from "../Base/BaseButton";
import { Select } from "../Inputs/Select";

export function NewPostModal({ isOpen, onClose, onSubmit, categories }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    
    if (file) {
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no puede superar los 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e, selectedImage); // Pasamos la imagen también
    
    // Limpiar estado
    //setSelectedImage(null);
    setImagePreview(null);
  };

  const handleClose = () => {
    // Limpiar estado al cerrar
    setSelectedImage(null);
    setImagePreview(null);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 z-40 animate-[fadeIn_0.2s_ease-out]"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-[30px] shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-[slideUp_0.2s_ease-out]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-dark">Nueva Publicación</h2>
            <button
              onClick={handleClose}
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
              className="w-full h-24 p-4 text-sm border border-gray-300 rounded-[30px] focus:outline-none focus:ring-2 bg-[#F1EDEC] text-[#383838] shadow-sm mb-4"
              placeholder="Escribí algo sobre tu logro..."
              required
            />

            {/* Botón para agregar imagen */}
            <div className="mb-4">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label 
                htmlFor="image-upload"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-dark-green hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                {selectedImage ? 'Cambiar imagen' : 'Agregar imagen'}
              </label>
            </div>

            {/* Preview de la imagen */}
            {imagePreview && (
              <div className="mb-4 relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full max-h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={handleClose}
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
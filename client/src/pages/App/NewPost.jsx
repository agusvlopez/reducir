import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useGetUserQuery } from "../../api/apiSlice";
import { useGetActionsQuery } from "../../api/actionsSlice";
import { Avatar } from "../../components/Base/Avatar";
import BaseButton from "../../components/Base/BaseButton";
import { Select } from "../../components/Inputs/Select";
import { usePosts } from "../../hooks/usePosts";
import { Loader } from "../../components/Base/Loader";

export function NewPost() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const actionIdFromUrl = searchParams.get('actionId');

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedActionId, setSelectedActionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const { addPost } = usePosts();

  const {data: actions, error: actionsError, isError: isActionsError, isLoading: isLoadingActions } = useGetActionsQuery();
  const { data: userData, isLoading: isUserLoading } = useGetUserQuery(user?._id, { skip: !user?._id });
  const actionsAchievedInUser = userData?.actions_achieved || [];

  
  const achievedActions = actionsAchievedInUser?.map((actionId) => {
    return actions?.find(a => a._id === actionId);
  }).filter(Boolean);

  const selectedAction = achievedActions?.find(action => action._id === selectedActionId || action._id == selectedActionId);

  // Setear el actionId desde la URL cuando el componente se monta o cambia
  useEffect(() => {
    if (actionIdFromUrl && achievedActions && achievedActions.length > 0) {
      setSelectedActionId(actionIdFromUrl);
    }
  }, [actionIdFromUrl, achievedActions]);
  
  const handleActionChange = (value) => {
    setSelectedActionId(value);
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await addPost(e, selectedImage, selectedActionId, selectedAction?.carbon, selectedAction?.category);

      navigate(`/app/${userData?._id}/post/${response._id}`);
      
    } catch (error) {
      console.error('Error al publicar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-dark">Nueva Publicación</h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-[30px] shadow-lg">
          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar
                src={userData?.image}
                alt={userData ? `${userData.firstName} ${userData.lastName}` : "Usuario"}
                size="lg"
                isBordered={true}
              />
              <div className="flex-1">
                {selectedActionId !== "" ? (
                  <div className="mb-2 text-sm text-dark-green font-medium">
                    Seleccionaste la acción: "{selectedAction?.title}"
                  </div>
                ) : (
                  <Loader />
                )}
              </div>
            </div>

            <textarea
              name="content"
              id="content"
              rows="6"
              className="w-full p-4 text-sm border border-gray-300 rounded-[30px] focus:outline-none focus:ring-2 focus:ring-dark-green bg-[#F1EDEC] text-[#383838] shadow-sm mb-4"
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
              <div className="mb-6 relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full max-h-96 object-cover rounded-lg"
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
            
            {/* Información de la acción seleccionada */}
            {selectedAction && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <h3 className="font-semibold text-gray-dark">Impacto de tu acción</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium">Carbono reducido:</span> <span className="text-dark-green font-semibold">-{selectedAction.carbon} kg CO₂</span>
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium">Categoría:</span> <span className="capitalize">{selectedAction.category}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <BaseButton
                type="submit"
                color="green"
                isLoading={isLoading}
              >
                Publicar
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
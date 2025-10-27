import { Avatar } from "../../components/Base/Avatar";
import { Heading } from "../../components/Base/Heading";
import editIcon from "../../assets/icons/edit.png";
import BaseInput from "../../components/Inputs/BaseInput";
import { useState } from "react";
import BaseButton from "../../components/Base/BaseButton";
import { useAuth } from "../../hooks/useAuth";
import { useDeleteAccountMutation, useGetUserQuery, useUpdateUserMutation } from "../../api/apiSlice";
import { toast } from "sonner";

export function ProfileSettings() {
  const { handleLogout, userId } = useAuth();
  const [updateUser] = useUpdateUserMutation();
  const { data: userData, isLoading: isUserDataLoading } = useGetUserQuery(userId, { skip: !userId });
  const [deleteAccount, { isLoading: isDeleteAccountLoading }] = useDeleteAccountMutation();

  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [editImageModal, setEditImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [isEmailNameLoading, setIsEmailNameLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isUpdateImageLoading, setIsUpdateImageLoading] = useState(false);

  const toggleDeleteAccountModal = () => {
    setDeleteAccountModal(!deleteAccountModal);
  }

  const handleDeleteAccount = async () => {
    // Lógica para eliminar la cuenta
    await deleteAccount({ userId });
    toast.success('Cuenta eliminada con éxito');
    handleLogout();

    toggleDeleteAccountModal();
  }

  const toggleEditImageModal = () => {
    setEditImageModal(!editImageModal);
    // Limpiar el preview al cerrar
    if (editImageModal) {
      setSelectedImage(null);
      setImagePreview(null);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no puede superar los 5MB');
        return;
      }

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
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

  const handleEditImage = async (e) => {
    e.preventDefault();
    setIsUpdateImageLoading(true);
    
    if (!selectedImage) {
      alert('Por favor selecciona una imagen');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      await updateUser({ userId, body: formData });
      setIsUpdateImageLoading(false);

      toast.success('Imagen actualizada con éxito');

      // Limpiar estados y cerrar modal
      setSelectedImage(null);
      setImagePreview(null);
      toggleEditImageModal();
    } catch (error) {
      console.error('Error al actualizar la imagen:', error);
      setIsUpdateImageLoading(false);
      toast.error('Hubo un error al actualizar la imagen');
    }
  }

  const handleEditNameEmail = async (e) => {
    e.preventDefault();
    setIsEmailNameLoading(true);
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');

    const updateBody = { name, email };
    // Solo incluimos 'image' en el cuerpo de la actualización si se ha seleccionado una nueva imagen.
    // Si selectedImage es null, significa que no se eligió una nueva imagen, por lo que no tocamos el campo de imagen.
    // Si quisiéramos una funcionalidad explícita de "eliminar imagen", entonces selectedImage podría ser null para ese propósito.

    try {
      await updateUser({ userId, body: updateBody });
      setIsEmailNameLoading(false);
      toast.success('Información actualizada con éxito');
    } catch (error) {
      console.error('Error al actualizar la información:', error);
      setIsEmailNameLoading(false);
      toast.error('Hubo un error al actualizar la información');
    }
  }

  const handleEditPassword = async (e) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    
    const formData = new FormData(e.target);
    const newPassword = formData.get('newPassword');

    const updateBody = { password: newPassword };

    try {
      await updateUser({ userId, body: updateBody });
      setIsPasswordLoading(false);
      toast.success('Contraseña actualizada con éxito');
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      setIsPasswordLoading(false);
      toast.error('Hubo un error al actualizar la contraseña');
    }
  }

  return (
    <>
      {/* Modal de eliminación de cuenta */}
      {/* TODO: NO ESTA HECHA LA FUNCIONALIDAD */}
      {deleteAccountModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-[30px] shadow-lg max-w-[80%] flex flex-col gap-2">
            <Heading tag="h3" size="h4" weight="semibold">¿Estás seguro de que quieres eliminar tu cuenta?</Heading>
            <p className="mb-4">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-4">
              <BaseButton
                variant="danger"
                onClick={handleDeleteAccount}
                isLoading={isDeleteAccountLoading}
                isArray={false}
              >
                Eliminar cuenta
              </BaseButton>
              <BaseButton
                variant="outline"
                onClick={toggleDeleteAccountModal}
                isArray={false}>       
                Cancelar
              </BaseButton>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición de imagen */}
      {editImageModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-[30px] shadow-lg max-w-[80%] flex flex-col gap-4">
            <Heading tag="h3" size="h4" weight="semibold">Editar imagen de perfil</Heading>
            <p>Subir nueva imagen de perfil.</p>
            
            <form onSubmit={handleEditImage} className="flex flex-col gap-4">
              {/* Preview de la imagen */}
              {(imagePreview || userData?.image) && (
                <div className="flex justify-center mb-4">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#005840]">
                    <img 
                      src={imagePreview || userData.image} 
                      alt="Imagen de perfil" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              {/* Botón para agregar imagen */}
              <div className="mb-2">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  id="image-upload"
                  className="hidden"
                />
                <label 
                  htmlFor="image-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-dark-green hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  {selectedImage || userData.image ? 'Cambiar imagen' : 'Agregar imagen'}
                </label>
            </div>
              
              <div className="flex justify-end gap-4">
                <BaseButton
                  type="submit"
                  disabled={!selectedImage}
                  isLoading={isUpdateImageLoading}
                  isArray={false}
                >
                  Guardar cambios
                </BaseButton>
                <BaseButton
                  variant="outline"
                  type="button"
                  isArray={false}
                  onClick={toggleEditImageModal}>
                  Cancelar
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="h-screen bg-[#005840] py-6">
      <div className="flex items-center gap-6 mb-8 px-6">
        <Heading tag="h1" size="h2" weight="semibold" align="left" color="white">Ajustes del perfil</Heading>
      </div>

      {/* Email and email update */}
      {isUserDataLoading && <p>Cargando información del usuario...</p>}
      <div className="bg-[#F5F5F5] rounded-t-[30px] p-6 pb-20 flex flex-col gap-8">
        <div className="relative w-fit mx-auto mt-4 flex flex-col items-center gap-8">
          <Avatar 
            src={userData?.image}
            alt={userData?.name}
            size="xxl"
          />
          <button 
          onClick={toggleEditImageModal}
          className="w-6 h-6 p-1 inline-block rounded-full bg-[#F1EDEC] shadow-xl absolute -top-1 -right-1 cursor-pointer">
            <img src={editIcon} alt="Editar" className="w-full h-full object-contain" />
          </button>
        </div>
        <div>
          <form onSubmit={handleEditNameEmail} className="flex flex-col gap-6">
            <BaseInput 
              label="Nombre"
              inputName="name"
              inputType="text"
              inputPlaceholder={userData?.name}
              className="mb-4"
            />
            <BaseInput 
              label="Correo electrónico"
              inputName="email"
              inputType="email"
              inputPlaceholder={userData?.email}
              className="mb-4"
            />
            <div className="flex self-end justify-end">
              <BaseButton
                type="submit"
                isLoading={isEmailNameLoading}
              >
                Guardar cambios
              </BaseButton>
            </div>
          </form>
        </div>
        {/* line */}
        <span className="h-[1px] w-full bg-[#6D6D6D] mx-auto"></span>

        {/* password update */}
        <div className="flex flex-col gap-4">
          <Heading tag="h2" size="h3" weight="semibold" align="left" color="green">Cambiar contraseña</Heading>
          <form onSubmit={handleEditPassword} className="flex flex-col gap-6" action="">
            <BaseInput 
              label="Nueva contraseña"
              inputName="newPassword"
              inputType="password"
              inputPlaceholder="Tu nueva contraseña"
              className="mb-4"
            />
            <div className="flex self-end justify-end">
              <BaseButton
                type="submit"
                isLoading={isPasswordLoading}
              >
                Cambiar contraseña
              </BaseButton>
            </div>
          </form>
        </div>

        {/* line */}
        <span className="h-[1px] w-full bg-[#6D6D6D] mx-auto"></span>

      {/* logout and delete account */}
        <div className="flex flex-col gap-4 mb-4">
          <BaseButton
            onClick={handleLogout}
            className="w-full"
            variant="outline">
            Cerrar sesión
          </BaseButton>
            <BaseButton
              onClick={toggleDeleteAccountModal}
              className="w-full"
            >
            Eliminar cuenta
          </BaseButton>
        </div>
      </div>
      </section>
    </>
  )
}
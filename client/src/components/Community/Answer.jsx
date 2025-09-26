import { Avatar } from "../Base/Avatar";
import BaseButton from "../Base/BaseButton";
import { BaseTextarea } from "../Inputs/BaseTextarea";

export function Answer ({
    labelButton = "Responder",
    placeholder = "Comentá tu respuesta",
    name = "comment",
    srcAvatar = "https://i.pravatar.cc/300",
}) {
    const handleSubmitAnswer = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const content = formData.get(name);
        console.log(content);
        // TODO (FALTA LOGICA DE BACKEND)
    }

    return (
      <>
      {/* POST A COMMENT (FORM) */}
      <div className="flex items-start justify-between gap-4 border-b border-[#6D6D6D] pb-6">
          <Avatar
              src={srcAvatar}
          />
          <form 
            className="flex-1 flex flex-col gap-2 items-end"
            onSubmit={handleSubmitAnswer}
          >
              <BaseTextarea
                  name={name}
                  placeholder={placeholder}
              />
              <BaseButton buttonType="submit">
                  { labelButton }
              </BaseButton>
          </form>
      </div>
      </>
    )
}
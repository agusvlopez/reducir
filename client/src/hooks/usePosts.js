import { toast } from "sonner";
import { useCreatePostMutation } from "../api/postsSlice";
import { useAuth } from "./useAuth";

export const usePosts = () => {
    const {user} = useAuth();
    const [createPost] = useCreatePostMutation();

    const addPost = async (e, imageFile, actionId, carbon, category) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const content = formData.get("content");
        const achievedAction = formData.get("achieved_action");

        const postData = new FormData();
        postData.append('userId', user?._id);
        postData.append('userInfo', JSON.stringify({
            name: user?.name, 
            username: user?.username, 
            profileImage: user?.image
        }));
        postData.append('category', category);
        postData.append('content', content);
        postData.append('achievedAction', achievedAction);
        postData.append('actionId', actionId);
        postData.append('carbon_reduced', carbon);

        if (imageFile) {
            postData.append('image', imageFile);
        }

        try {            
            const response = await createPost(postData);
            
            if (response.error) {
                toast.error("Error al crear el post. Por favor, inténtalo de nuevo.");
                return false;
            }

            toast.success("Post creado con éxito!");
            return true;
        } catch (error) {
            console.error(error);
            toast.error("Error al crear el post. Por favor, inténtalo de nuevo.");
            return false;
        }
    }

  return { addPost };
}
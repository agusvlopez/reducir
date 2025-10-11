import { useEffect, useState } from "react";
import { Avatar } from "../../components/Base/Avatar";
import { Post } from "../../components/Community/Post";
import { Search } from "../../components/Inputs/Search";
import { Select } from "../../components/Inputs/Select";
import BaseButton from "../../components/Base/BaseButton";
import { useCreatePostMutation, useGetPostsQuery } from "../../api/postsSlice";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import { NewPostModal } from "../../components/Community/NewPostModal";
import { Loader } from "../../components/Base/Loader";

//TODO: PASAR ESTO A UN ARCHIVO DE CONSTANTES PARA REUTILIZARLO
const categories = [
    { id: 1, value: "energía", label: "Energía" },
    { id: 2, value: "transporte", label: "Transporte" },
    { id: 3, value: "reciclaje", label: "Reciclaje" },
    { id: 4, value: "alimentación", label: "Alimentación" },
    { id: 5, value: "agua", label: "Agua" },
    { id: 6, value: "otros", label: "Otros" }
];

export function Community() {
    const {user} = useAuth();
    const {data: posts, isError, isLoading} = useGetPostsQuery();
    const [createPost] = useCreatePostMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    const openFormNewPost = () => {
        setIsModalOpen(true);
    }

    //TODO: PASAR A UN COMPONENTE APARTE ESTO JUNTO CON EL FORMULARIO
    const handleAddPost = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const category = formData.get("category");
        const content = formData.get("content");

        const response =  await createPost({
                userId: user?._id, 
                userInfo: {
                    name: user?.name, 
                    username: user?.username, 
                    profileImage: user?.image
                },
                category,
                content
            });

        if (response.error) {
            toast.error("Error al crear el post. Por favor, intantalo de nuevo.");
            return;
        }

        toast.success("Post creado con éxito!");
        setIsModalOpen(false);
    }
    
    const handleSearch = (value) => {
        setSearchQuery(value);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Filtrar posts basado en la búsqueda
    const getFilteredPosts = () => {
        if (!debouncedQuery.trim()) return posts;

        const query = debouncedQuery.toLowerCase();
        return posts?.filter(post => 
            post.content?.toLowerCase().includes(query) ||
            post.userInfo?.name?.toLowerCase().includes(query) ||
            post.userInfo?.username?.toLowerCase().includes(query) ||
            post.category?.toLowerCase().includes(query)
        );
    }

    const filteredPosts = getFilteredPosts();
    const isSearching = searchQuery !== debouncedQuery;

    return (
        <>
            <section className="h-screen bg-[#005840] py-6">
                <div className="flex items-center gap-6 mb-8 px-6">
                    <Avatar
                        src="https://www.gravatar.com/avatar"
                        alt="User Avatar"
                        size="sm"
                        isBordered={true}
                        className="mx-auto"
                    />
                    <Search 
                        className="flex-1"
                        onSearch={handleSearch}
                        placeholder="Buscar publicaciones..."
                    />
                </div>
                
                {/* CREAR UN NUEVO POST */}
                <div className="bg-[#F5F5F5] rounded-t-[30px] p-6 pb-20 h-screen overflow-y-auto">
                    <button
                        onClick={openFormNewPost}
                        className="flex items-center gap-[10px] font-semibold mb-8 text-dark-green cursor-pointer hover:text-dark-green/90 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Compartir un nuevo logro
                    </button>
                    
                    <NewPostModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleAddPost}
                        categories={categories}
                    />
                    
                    <div className="flex flex-col gap-6">
                        {isLoading && <p className="text-gray-500">Cargando posts...</p>}
                        {isError && <p className="text-red-500">Error al cargar los posts.</p>}
                        
                        {/* Mensaje de "Buscando..." */}
                        {isSearching && searchQuery && (
                            <div className="text-center py-8">
                                <Loader />
                            </div>
                        )}
                        
                        {/* Mostrar mensaje si no hay resultados */}
                        {!isLoading && !isError && !isSearching && filteredPosts?.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-600 font-medium mb-2">
                                    {debouncedQuery 
                                        ? 'No se encontraron publicaciones' 
                                        : 'No hay publicaciones'}
                                </p>
                                {debouncedQuery && (
                                    <p className="text-gray-500 text-sm">
                                        Intenta con otros términos de búsqueda
                                    </p>
                                )}
                            </div>
                        )}
                        
                        {/* Mostrar posts solo si no está buscando */}
                        {!isSearching && filteredPosts?.map((post) => (
                            <Post 
                                key={post._id}
                                id={post._id}
                                name={post.userInfo.name}
                                username={post.userInfo.username}
                                profileImage={post.userInfo.profileImage}
                                image={post.image}
                                content={post.content}
                                category={post.category}
                                createdAt={post.createdAt}
                                likesCount={post.likesCount}
                                commentsCount={post.commentsCount}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
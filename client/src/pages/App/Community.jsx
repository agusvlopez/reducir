import { useEffect, useState } from "react";
import { Avatar } from "../../components/Base/Avatar";
import { Post } from "../../components/Community/Post";
import { Search } from "../../components/Inputs/Search";
import { NewPostModal } from "../../components/Community/NewPostModal";
import { Loader } from "../../components/Base/Loader";
import { usePosts } from "../../hooks/usePosts";
import { useGetPostsQuery } from "../../api/postsSlice";
import { CATEGORIES } from "../../constants/categories";

export function Community() {
    //const {user} = useAuth();
    const { addPost } = usePosts();
    const {data: posts, isError, isLoading} = useGetPostsQuery();
    //const [createPost] = useCreatePostMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    const openFormNewPost = () => {
        setIsModalOpen(true);
    }

    const handleAddPost = async (...args) => {
        const success = await addPost(...args);
        if (success) {
            setIsModalOpen(false);
        }
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
                        categories={CATEGORIES}
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
                                actionId={post?.actionId}
                                carbon={post?.carbon_reduced}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
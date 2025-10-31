import { useEffect, useState } from "react";
import { Avatar } from "../../components/Base/Avatar";
import { Post } from "../../components/Community/Post";
import { Search } from "../../components/Inputs/Search";
import { NewPostModal } from "../../components/Community/NewPostModal";
import { Loader } from "../../components/Base/Loader";
import { usePosts } from "../../hooks/usePosts";
import { useDeletePostMutation, useGetFeedQuery } from "../../api/postsSlice";
import { CATEGORIES } from "../../constants/categories";
import { useGetSuggestedUsersQuery, useGetUserQuery } from "../../api/apiSlice";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { AppHeaderSection } from "../../components/Sections/AppHeader";
import BaseButton from "../../components/Base/BaseButton";

export function Community() {
    const { userId } = useAuth();
    const { addPost } = usePosts();
    const { data: posts, isError, isLoading: isPostsLoading } = useGetFeedQuery({ userId, page: 1, limit: 10});
    const { data: suggestedUsers, isLoading: isSuggestedUsersLoading} = useGetSuggestedUsersQuery(userId);
    const { data: userData, isLoading: isUserLoading, isError: isUserError } = useGetUserQuery(userId);

    const [deletePost] = useDeletePostMutation();

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

    const getFilteredPosts = () => {
        if (!debouncedQuery.trim()) return posts?.data;

        const query = debouncedQuery.toLowerCase();
        return posts?.data?.filter(post => 
            post.content?.toLowerCase().includes(query) ||
            post.userInfo?.name?.toLowerCase().includes(query) ||
            post.userInfo?.username?.toLowerCase().includes(query) ||
            post.category?.toLowerCase().includes(query)
        );
    }

    const filteredPosts = getFilteredPosts();
    const isSearching = searchQuery !== debouncedQuery;

    const handleDeletePost = async ({ postId, userId }) => {
        try {
            await deletePost({ postId, userId });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            {/* Header fijo en desktop */}
            <div className="sticky top-0 z-10 bg-[#005840] rounded-b-[30px] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 py-4">
                        {isUserLoading && <Loader size="sm" color="white" />}
                        {isUserError && <p className="text-red-500">Error al cargar el usuario.</p>}
                        
                        <Avatar
                            src={userData?.image}
                            alt={userData?.name}
                            size="sm"
                            isBordered={true}
                        />
                        <Search 
                            className="flex-1 max-w-md"
                            onSearch={handleSearch}
                            placeholder="Buscar..."
                        />
                    </div>
                </div>
            </div>

            {/* Contenido principal con layout de 2 columnas en desktop */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Columna izquierda - Sidebar (sticky en desktop) */}
                    <aside className="lg:col-span-1">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            {/* Personas sugeridas */}
                            <div className="bg-white rounded-[30px] shadow-sm p-6">
                                <h2 className="text-[#005840] font-semibold text-lg mb-4">
                                    Personas sugeridas
                                </h2>
                                <div className="flex flex-col gap-3">
                                    {isSuggestedUsersLoading && <Loader size="sm" color="#005840" />}
                                    {suggestedUsers?.data?.slice(0, 5).map((user) => (
                                        <Link 
                                            to={`/app/home/${user._id}`} 
                                            key={user._id}
                                            className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                        >
                                            <Avatar
                                                src={user?.image}
                                                alt={user?.name}
                                                size="sm"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {user?.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    @{user?.username}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Botón crear post */}
                            <BaseButton
                                onClick={openFormNewPost}
                                className="w-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                Nuevo logro
                            </BaseButton>
                        </div>
                    </aside>

                    {/* Columna derecha - Feed de posts */}
                    <main className="lg:col-span-2">
                        <NewPostModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSubmit={handleAddPost}
                            categories={CATEGORIES}
                        />
                        
                        <div className="flex flex-col gap-4">
                            {isPostsLoading && (
                                <div className="text-center py-8">
                                    <Loader />
                                    <p className="text-gray-500 mt-2">Cargando posts...</p>
                                </div>
                            )}
                            
                            {isError && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl">
                                    Error al cargar los posts.
                                </div>
                            )}
                            
                            {isSearching && searchQuery && (
                                <div className="text-center py-8">
                                    <Loader />
                                    <p className="text-gray-500 mt-2">Buscando...</p>
                                </div>
                            )}
                            
                            {!isPostsLoading && !isError && !isSearching && filteredPosts?.length === 0 && (
                                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-400 mb-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
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
                            
                            {!isSearching && filteredPosts?.map((post) => (
                                <Post 
                                    key={post._id}
                                    id={post._id}
                                    name={post.userId?.name}
                                    username={post?.userId?.username}
                                    profileImage={post?.userId?.image}
                                    image={post.image}
                                    content={post.content}
                                    category={post.category}
                                    createdAt={post.createdAt}
                                    likesCount={post.likesCount}
                                    commentsCount={post.commentsCount}
                                    actionId={post?.actionId}
                                    carbon={post?.carbon_reduced}
                                    postUserId={post?.userId?._id}
                                    onDelete={() => handleDeletePost({ postId: post._id, userId: userId})}
                                />
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
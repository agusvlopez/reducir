import { Avatar } from "../../components/Base/Avatar";
import { Pill } from "../../components/Base/Pill";
import { CarouselCard } from "../../components/Cards/CarouselCard";
import ACTIONS from "../../assets/data/greenSteps.actions.json";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BaseCarousel } from "../../components/Base/BaseCarousel";
import { useGetUserQuery } from "../../api/apiSlice";
import { useGetPostsByUserQuery, useGetPostsLikedByUserIdQuery } from "../../api/postsSlice";
import { GoalProgressCard } from "../../components/Cards/GoalProgressCard";
import { Post } from "../../components/Community/Post";
import { AchievementCard } from "../../components/Cards/AchievementCard";
import { useAuth } from "../../hooks/useAuth";
import { useFollowUserMutation, useGetFollowCountsQuery, useIsFollowingQuery, useUnfollowUserMutation } from "../../api/followSlice";
import { useGetSavedActionsQuery } from "../../api/actionsSlice";
import {Loader} from "../../components/Base/Loader";
import ButtonLink from "../../components/Base/ButtonLink";
import GoalStatusCard from "../../components/Cards/GoalStatusCard";

export function Home() { 
    const { userId } = useParams();
    const { userId: authUserId } = useAuth();
    const { data: userData, isLoading: isUserLoading, isError: isUserError, error: userError} = useGetUserQuery(userId, { skip: !userId });

    const { data: ownUserPostsData, isLoading: ownUserPostsLoading, isError: ownUserPostsError } = useGetPostsByUserQuery(authUserId, { skip: !authUserId });
    const { data: userPostsData, isLoading: userPostsLoading, isError: userPostsError} = useGetPostsByUserQuery(userId, { skip: !userId });
    const { data: followCountsData, isLoading: followCountsLoading, isError: followCountsError} = useGetFollowCountsQuery(userId, { skip: !userId });
    const { data: postsLikedByUserIdData, isLoading: postsLikedByUserIdLoading, isError: postsLikedByUserIdError } = useGetPostsLikedByUserIdQuery(authUserId, { skip: !authUserId });

    const isOwnProfile = userId === authUserId;

    const { data: isFollowing, isLoading: isFollowingLoading, isError: isFollowingError} = useIsFollowingQuery(
        { followerId: authUserId, followingId: userId },
        { skip: !userId || isOwnProfile }
    );

    const [ followUser ] = useFollowUserMutation();
    const [ unfollowUser ] = useUnfollowUserMutation();

    const [sectionSelected, setSectionSelected] = useState("actionsSaved");

    const actionsAchieved = useMemo(() => userData?.actions_achieved || [], [userData]);

    // Usamos useGetActionsQuery para obtener todas las acciones
    //TODO: pasar a un hook ? 
    //Esto va una vez que acomode la API de actions
    // const { data: actions, error: isError, isLoading } = useGetActionsQuery();
    // console.log("actions", actions);

    const { data: actionsSaved = [], isLoading: actionsSavedLoading, isError: actionsSavedError } = useGetSavedActionsQuery(
        userId,
        { skip: !userId }
    );

    const handleSections = (value) => {
        setSectionSelected(value);
    }

    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await unfollowUser({
                    followerId: authUserId,
                    followingId: userId
                });                
            } else {
                await followUser({
                    followerId: authUserId,
                    followingId: userId
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    if (isUserError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-dark-green mb-4">
                        Usuario no encontrado
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {userError?.status === 404 
                            ? 'Este usuario no existe o ha sido eliminado.'
                            : 'Hubo un problema al cargar el perfil.'}
                    </p>
                    <Link 
                        to={`/app/home/${authUserId}`} 
                        className="bg-dark-green text-white px-6 py-2 rounded-full hover:bg-[#004030] transition-colors"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }
    
    if (isUserLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6">
                <Loader size="lg" color="dark-green" />
            </div>
        );
    }

    return (
        <>
            <section className="flex flex-col bg-[#005840] text-white p-4 px-6 pb-22 rounded-b-[30px]">
                <div className="flex items-start gap-4">
                    <div className="flex-1 md:flex-0">
                        <Avatar 
                            size="xl"
                            src={userData?.image}
                            alt={userData?.name}
                            className="mb-4"   
                        />
                    </div>
                    {isOwnProfile ? 
                        <div className="flex flex-col md:gap-1">
                            <p className="font-medium md:text-lg">Estás a un paso de cambiar el mundo, <span className="font-semibold">{isUserLoading ? '...' : userData?.name}</span>!</p>
                            <p>Tu huella de carbono este mes:</p>
                            <div className="flex items-center gap-2">
                                <span>
                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 15C0 12.2386 2.23858 10 5 10H18V21H5.5C2.46243 21 0 18.5376 0 15.5V15Z" fill="#F1EDEC"/>
                                    <rect x="10" y="8" width="15" height="13" rx="6.5" fill="#F1EDEC"/>
                                    <rect x="5.47754" y="16.4589" width="13" height="13.2482" rx="6.36543" transform="rotate(-92.105 5.47754 16.4589)" fill="#F1EDEC"/>
                                    <path d="M10.52 11.672C10.6587 11.7413 10.7387 11.8507 10.76 12C10.7867 12.1493 10.7493 12.2853 10.648 12.408C10.5787 12.504 10.488 12.5573 10.376 12.568C10.2693 12.5787 10.16 12.5573 10.048 12.504C9.92 12.4453 9.784 12.4 9.64 12.368C9.50133 12.336 9.35467 12.32 9.2 12.32C8.912 12.32 8.65333 12.3653 8.424 12.456C8.2 12.5467 8.008 12.6773 7.848 12.848C7.688 13.0133 7.56533 13.2107 7.48 13.44C7.4 13.6693 7.36 13.9227 7.36 14.2C7.36 14.5253 7.40533 14.808 7.496 15.048C7.592 15.288 7.72267 15.488 7.888 15.648C8.05333 15.808 8.248 15.928 8.472 16.008C8.696 16.0827 8.93867 16.12 9.2 16.12C9.344 16.12 9.488 16.1067 9.632 16.08C9.776 16.0533 9.91467 16.0053 10.048 15.936C10.16 15.8827 10.2693 15.864 10.376 15.88C10.488 15.896 10.5813 15.952 10.656 16.048C10.7627 16.1813 10.8 16.32 10.768 16.464C10.7413 16.6027 10.6613 16.704 10.528 16.768C10.3893 16.8373 10.2453 16.896 10.096 16.944C9.952 16.9867 9.80533 17.0187 9.656 17.04C9.50667 17.0667 9.35467 17.08 9.2 17.08C8.816 17.08 8.45067 17.0187 8.104 16.896C7.76267 16.7733 7.456 16.592 7.184 16.352C6.91733 16.112 6.70667 15.8133 6.552 15.456C6.39733 15.0933 6.32 14.6747 6.32 14.2C6.32 13.7893 6.38933 13.4107 6.528 13.064C6.672 12.7173 6.872 12.4187 7.128 12.168C7.38933 11.912 7.696 11.7147 8.048 11.576C8.4 11.432 8.784 11.36 9.2 11.36C9.43467 11.36 9.664 11.3867 9.888 11.44C10.112 11.4933 10.3227 11.5707 10.52 11.672ZM16.7676 14.2C16.7676 14.6 16.701 14.9733 16.5676 15.32C16.4343 15.6667 16.245 15.9733 15.9996 16.24C15.7596 16.5013 15.4716 16.7067 15.1356 16.856C14.805 17.0053 14.4423 17.08 14.0476 17.08C13.653 17.08 13.2903 17.0053 12.9596 16.856C12.629 16.7067 12.341 16.5013 12.0956 16.24C11.8556 15.9733 11.669 15.6667 11.5356 15.32C11.4023 14.9733 11.3356 14.6 11.3356 14.2C11.3356 13.8 11.4023 13.4267 11.5356 13.08C11.669 12.7333 11.8556 12.4293 12.0956 12.168C12.341 11.9013 12.629 11.6933 12.9596 11.544C13.2903 11.3947 13.653 11.32 14.0476 11.32C14.4423 11.32 14.805 11.3947 15.1356 11.544C15.4716 11.6933 15.7596 11.9013 15.9996 12.168C16.245 12.4293 16.4343 12.7333 16.5676 13.08C16.701 13.4267 16.7676 13.8 16.7676 14.2ZM15.7276 14.2C15.7276 13.8427 15.6556 13.52 15.5116 13.232C15.3676 12.9387 15.1703 12.7067 14.9196 12.536C14.669 12.3653 14.3783 12.28 14.0476 12.28C13.717 12.28 13.4263 12.3653 13.1756 12.536C12.925 12.7067 12.7276 12.936 12.5836 13.224C12.445 13.512 12.3756 13.8373 12.3756 14.2C12.3756 14.5573 12.445 14.8827 12.5836 15.176C12.7276 15.464 12.925 15.6933 13.1756 15.864C13.4263 16.0347 13.717 16.12 14.0476 16.12C14.3783 16.12 14.669 16.0347 14.9196 15.864C15.1703 15.6933 15.3676 15.464 15.5116 15.176C15.6556 14.8827 15.7276 14.5573 15.7276 14.2Z" fill="#005840"/>
                                    <path d="M18.832 17.56C18.896 17.56 18.9493 17.5813 18.992 17.624C19.0347 17.6667 19.056 17.72 19.056 17.784C19.056 17.8453 19.0347 17.8973 18.992 17.94C18.9493 17.98 18.896 18 18.832 18H17.472C17.4027 18 17.348 17.9787 17.308 17.936C17.268 17.8933 17.248 17.8387 17.248 17.772C17.248 17.7053 17.272 17.6467 17.32 17.596L18.192 16.664C18.2907 16.5573 18.368 16.448 18.424 16.336C18.4827 16.224 18.512 16.1267 18.512 16.044C18.512 15.9107 18.4733 15.804 18.396 15.724C18.3187 15.6413 18.216 15.6 18.088 15.6C18.0373 15.6 17.9853 15.612 17.932 15.636C17.8787 15.66 17.8267 15.6933 17.776 15.736C17.728 15.7787 17.6827 15.828 17.64 15.884C17.608 15.9267 17.576 15.9533 17.544 15.964C17.512 15.9747 17.4827 15.98 17.456 15.98C17.3973 15.98 17.3427 15.9587 17.292 15.916C17.244 15.8707 17.22 15.8187 17.22 15.76C17.22 15.7147 17.2347 15.6707 17.264 15.628C17.296 15.5853 17.3347 15.5413 17.38 15.496C17.4467 15.4293 17.5213 15.3707 17.604 15.32C17.6867 15.2693 17.772 15.2307 17.86 15.204C17.948 15.1747 18.0333 15.16 18.116 15.16C18.2947 15.16 18.4493 15.196 18.58 15.268C18.7133 15.3373 18.816 15.4373 18.888 15.568C18.96 15.696 18.996 15.848 18.996 16.024C18.996 16.1707 18.952 16.3347 18.864 16.516C18.7787 16.6947 18.6627 16.8627 18.516 17.02L17.976 17.596L17.932 17.56H18.832Z" fill="#005840"/>
                                    </svg>
                                </span>
                                <p className="font-semibold"><span className="font-bold">{isUserLoading ? '-' : userData?.carbon}</span> kg de CO2</p>
                            </div>
                        </div>
                        :
                        <>
                            <div>
                                <div className="flex flex-col mb-2">
                                    <span className="font-semibold">{isUserLoading ? '...' : userData?.name}</span>
                                    <span className="text-sm">@{userData?.username}</span>
                                </div>  
                                <p className="text-sm">Huella de carbono este mes:</p>
                                <div>
                                    <span></span>
                                    <p className="font-semibold"><span className="font-bold">{isUserLoading ? '-' : userData?.carbon}</span> kg de CO2</p>
                                </div>                                                      
                            </div>
                            <div className="flex-1 flex justify-end">
                                {isFollowingError && <span className="text-white">Error al cargar si sigues o no.</span>}
                                {isFollowingLoading ? 
                                    <Loader size="sm" color="white"/>
                                    :
                                    <button 
                                        className={`rounded-full transition-colors  ${
                                        isFollowing 
                                            ? 'bg-[#005840] text-white hover:bg-[#004030]' 
                                            : 'bg-gray-100 text-[#005840] hover:bg-gray-200'
                                        }`}
                                        onClick={handleFollowToggle}
                                        disabled={isUserLoading}
                                    >
                                    {isFollowing ? (
                                        <button className="font-semibold bg-white text-dark-green rounded-[30px] text-xs px-2 py-1 hover:bg-gray-200 transition-all cursor-pointer">Siguiendo</button>
                                    ) : (
                                            <button className="font-semibold bg-white rounded-[30px] text-xs px-2 py-1 hover:bg-gray-200 transition-all cursor-pointer">Seguir</button>
                                        )}
                                    </button>  
                                }
                            </div>                          
                        </>
                    }  
                                  
                </div>

                {/* following & followers */}
                <div className="mt-4 flex items-center justify-center gap-4">
                    {followCountsLoading && <Loader size="sm" color="white" />}
                    {followCountsError && <span className="text-white">Error al cargar los datos.</span>}
                    
                    <Link to={`/app/${userId}/following`} className="hover:text-gray-200 hover:underline transition-all"><span className="font-semibold">{followCountsData?.followingCount}</span> Siguiendo</Link>
                    <Link to={`/app/${userId}/followers`} className="hover:text-gray-200 hover:underline transition-all"><span className="font-semibold">{followCountsData?.followersCount}</span> Seguidores</Link>
                </div>
            </section>

            {/* CARD GOAL */}
            <section>
                <GoalStatusCard 
                    userData={userData}
                    isOwnProfile={isOwnProfile}
                />
            </section>

            {isOwnProfile &&
                <section className="mt-[40px] flex gap-4 overflow-x-auto pl-6 lg:pl-0 pb-2">
                    <Pill className="flex-shrink-0" text="Acciones en proceso" onClick={() => handleSections('actionsSaved')} isActive={sectionSelected === 'actionsSaved'} />
                    <Pill className="flex-shrink-0" text="Acciones logradas" onClick={() => handleSections('actionsAchieved')} isActive={sectionSelected === 'actionsAchieved'}/>
                    <Pill className="flex-shrink-0" text="Mis publicaciones" onClick={() => handleSections('posts')} isActive={sectionSelected === 'posts'}/>
                    <Pill className="flex-shrink-0" text="Publicaciones guardadas" onClick={() => handleSections('postLikes')} isActive={sectionSelected === 'postLikes'}/>                    
                </section>
            }

            {sectionSelected === 'actionsSaved' && isOwnProfile &&            
            <section className="mt-[40px] px-6 flex flex-col gap-4">
                <div>
                    <h2 className="text-[20px] font-semibold">Mis acciones en proceso</h2>
                    <p className="text-sm">Opciones guardadas para hacer cuando te sientas listo/a.</p>
                </div>
                <Link to={"/app/actions"} className="font-semibold text-[#005840] flex items-center gap-2 hover:underline w-max">
                <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7.5" cy="7.5" r="7.5" fill="#005840"/>
                <path d="M7.5 4.875V10.125M4.875 7.5H10.125" stroke="#F1EDEC" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Agregar una acción
                </Link>

                {actionsSaved?.length === 0 &&
                    <div className="text-center py-8">
                        <p className="text-gray-600 font-medium mb-2">
                            No hay acciones guardadas
                        </p>
                    </div>
                }

                <BaseCarousel>
                    {/* TODO: USE SWIPER */}
                    {actionsSavedLoading && (
                        <Loader />
                    )}
                    {actionsSavedError && (
                        <p className="text-red-500">Error al cargar las acciones</p>
                    )}
                    {actionsSaved?.map((actionId) => {
                        const savedAction = ACTIONS?.find(a => a._id === actionId);

                        if (!savedAction) return null;

                        return (
                            <CarouselCard
                                key={savedAction._id}
                                actionId={savedAction._id}
                                title={savedAction?.title}
                                imageSrc={savedAction?.image?.url}
                                imageAlt={savedAction?.title}
                                className="mt-4"
                            />
                        );
                    })}
                </BaseCarousel>
            </section>
            }

            {sectionSelected === 'actionsAchieved' && isOwnProfile &&
            (
                <section className="mt-[40px] px-6 flex flex-col gap-4">
                    <div>
                        <h2 className="text-[20px] font-semibold">Acciones logradas</h2>
                        <p className="text-sm">Estas son las acciones que lograste hasta el momento. ¿Querés compartilo con tu comunidad?</p>
                    </div>

                    {actionsAchieved?.length === 0 &&
                        <div className="text-center py-8">
                            <p className="text-gray-600 font-medium mb-2">
                                No hay acciones guardadas
                            </p>
                        </div>
                    }

                    <BaseCarousel>
                        {actionsAchieved?.map((actionId) => {
                            const achievedAction = ACTIONS?.find(a => a._id === actionId);                        
                            
                            if (!achievedAction) return null;

                            return (
                                <AchievementCard
                                    key={achievedAction._id}
                                    actionId={achievedAction._id}
                                    title={achievedAction?.title}
                                    imageSrc={achievedAction?.image?.url}
                                    imageAlt={achievedAction?.title}
                                    className="mt-4"
                                />
                            );
                        })}
                    </BaseCarousel>
                </section>
            )
            }

            {sectionSelected === 'posts' && isOwnProfile &&
            //TODO: HACERLO EN UN COMPONENTE SEPARADO
            (
            <section className="mt-[40px] px-6 flex flex-col gap-4">
                <div>
                    <h2 className="text-[20px] font-semibold">Mis publicaciones</h2>
                    <p className="text-sm mb-2">Todas tus publicaciones se muestran acá.</p>
                    <Link to={"/app/posts"} className="text-dark-green font-semibold">Ir a comunidad</Link>

                    {ownUserPostsLoading && <Loader />}
                    {ownUserPostsError && <p className="text-red-500">Error al cargar las publicaciones</p>}
                    {ownUserPostsData?.length === 0 || ownUserPostsData === undefined && (
                        <div className="text-center py-8">
                            <p className="text-gray-600 font-medium mb-2">
                                No hay publicaciones
                            </p>
                        </div>
                    )}

                    <div>
                        {ownUserPostsData?.map((post) => {
                            return (
                                <div
                                className="mt-8 pt-4 border-t border-gray-300" 
                                key={post._id}>
                                <Post 
                                    id={post._id}
                                    name={post.userId?.name}
                                    username={post.userId?.username}
                                    profileImage={post.userId?.image}
                                    image={post.image}
                                    content={post.content}
                                    category={post.category}
                                    createdAt={post.createdAt}
                                    likesCount={post.likesCount}
                                    commentsCount={post.commentsCount}
                                    actionId={post?.actionId}
                                    carbon={post?.carbon_reduced}
                                />
                                </div>
                            );
                        })}
                    </div>
                </div>
                </section>
            )
            }

            {sectionSelected === 'postLikes' && isOwnProfile && (
                <section className="mt-[40px] px-6 flex flex-col gap-4">
                    <div>
                        <h2 className="text-[20px] font-semibold">Publicaciones guardadas</h2>
                        <p className="text-sm mb-2">Todas las publicaciones que guardaste se muestran acá</p>

                        {postsLikedByUserIdLoading && <Loader />}
                        {postsLikedByUserIdError && <p>Error al cargar las publicaciones guardadas.</p>}
                        {postsLikedByUserIdData?.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-600 font-medium mb-2">
                                    No hay publicaciones
                                </p>
                            </div>
                        )}

                        <div>
                            {postsLikedByUserIdData?.map((post) => {
                                console.log("postlikedbyuser", post);
                                
                                return (
                                    <div
                                    className="mt-8 pt-4 border-t border-gray-300" 
                                    key={post._id}>
                                    <Post 
                                        id={post.postId?._id}
                                        name={post.postId?.userId?.name}
                                        username={post.postId?.userId?.username}
                                        profileImage={post.postId?.userId?.image}
                                        image={post.postId?.image}
                                        content={post.postId?.content}
                                        category={post.postId?.category}
                                        createdAt={post.postId?.createdAt}
                                        likesCount={post.postId?.likesCount}
                                        commentsCount={post.postId?.commentsCount}
                                        actionId={post?.postId?.actionId}
                                        carbon={post?.postId?.carbon_reduced}
                                    />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {!isOwnProfile &&
                <section className="mt-[40px] px-6 flex flex-col gap-4">
                    <div>
                        <h2 className="text-[20px] font-semibold">Publicaciones de {userData?.name}</h2>
                        
                        {userPostsLoading && <Loader />}
                        {userPostsError && <p>Error al cargar las publicaciones.</p>}
                        {userPostsData?.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-600 font-medium mb-2">
                                    No hay publicaciones
                                </p>
                            </div>
                        )}
                                    
                        {userPostsData?.map((post) => {
                            return (
                                <div
                                className="mt-8 pt-4 border-t border-gray-300" 
                                key={post._id}>
                                <Post 
                                    id={post._id}
                                    name={post.userId?.name}
                                    username={post.userId?.username}
                                    profileImage={post.userId?.image}
                                    image={post.image}
                                    content={post.content}
                                    category={post.category}
                                    createdAt={post.createdAt}
                                    likesCount={post.likesCount}
                                    commentsCount={post.commentsCount}
                                    actionId={post?.actionId}
                                    carbon={post?.carbon_reduced}
                                />
                                </div>
                            );
                        })}
                    </div>                
                </section>}
        </>
    );
}
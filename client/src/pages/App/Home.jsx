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
                                <span>(icono)</span>
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
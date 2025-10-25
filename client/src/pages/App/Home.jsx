import { Avatar } from "../../components/Base/Avatar";
import { Pill } from "../../components/Base/Pill";
import { CarouselCard } from "../../components/Cards/CarouselCard";
import ACTIONS from "../../assets/data/greenSteps.actions.json";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BaseCarousel } from "../../components/Base/BaseCarousel";
import { useActionsSaved } from "../../hooks/useActionsSaved";
import { useGetUserQuery } from "../../api/apiSlice";
import { useGetPostsByUserQuery, useGetPostsLikedByUserIdQuery } from "../../api/postsSlice";
import { PostCard } from "../../components/Cards/PostCard";
import { GoalProgressCard } from "../../components/Cards/GoalProgressCard";
import { Post } from "../../components/Community/Post";
import { AchievementCard } from "../../components/Cards/AchievementCard";
import { useAuth } from "../../hooks/useAuth";
import { useFollowUserMutation, useGetFollowCountsQuery, useIsFollowingQuery, useUnfollowUserMutation } from "../../api/followSlice";

export function Home() { 
    const { userId } = useParams();
    const { userId: authUserId } = useAuth();
    const { data: userData, isLoading: isUserLoading } = useGetUserQuery(userId, { skip: !userId });

    const { data: ownUserPostsData } = useGetPostsByUserQuery(authUserId, { skip: !authUserId });
    const { data: userPostsData } = useGetPostsByUserQuery(userId, { skip: !userId });
    const { data: followCountsData } = useGetFollowCountsQuery(userId, { skip: !userId });
    const { data: postsLikedByUserIdData } = useGetPostsLikedByUserIdQuery(authUserId, { skip: !authUserId });

    const isOwnProfile = userId === authUserId;

    const { data: isFollowingData } = useIsFollowingQuery(
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

    const { actionsSaved } = useActionsSaved();

    const handleSections = (value) => {
        setSectionSelected(value);
    }
    
    const [isFollowing, setIsFollowing] = useState(isFollowingData);

    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await unfollowUser({
                    followerId: authUserId,
                    followingId: userId
                });                
                setIsFollowing(false);
            } else {
                await followUser({
                    followerId: authUserId,
                    followingId: userId
                });
                setIsFollowing(true);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>
            <section className="flex flex-col bg-[#005840] text-white p-4 px-6 pb-22 rounded-b-[30px]">
                <div className="flex items-start gap-4">
                    
                    <Avatar 
                        size="xl"
                        src={userData?.image}
                        alt={userData?.name}
                        className="mb-4"   
                    />
                    {isOwnProfile ? 
                        <div>
                            <p>¡Hola <span className="font-semibold">{isUserLoading ? '...' : userData?.name}</span>!</p>
                            <p>Tu huella de carbono este mes:</p>
                            <div>
                                <span></span>
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
                            </div>                          
                        </>
                    }  
                                  
                </div>
                <div className="mt-4 flex items-center justify-center gap-4">
                    {/* following y followers */}
                    <Link to={`/app/${userId}/following`} className="hover:text-gray-200 hover:underline transition-all"><span className="font-semibold">{followCountsData?.followingCount}</span> Siguiendo</Link>
                    <Link to={`/app/${userId}/followers`} className="hover:text-gray-200 hover:underline transition-all"><span className="font-semibold">{followCountsData?.followersCount}</span> Seguidores</Link>
                </div>
            </section>
            <section className="w-[354px] h-fit mx-auto mt-[-70px] bg-[#F5F5F5] rounded-[30px] shadow-lg p-4 flex justify-between items-center">
                {userData?.carbonGoal?.status === 'inactive' ? 

                    <div className="p-2">
                        {/* TODO: ESTILAR */}
                        {userData?.carbon === 0 ? 
                            <>
                                <h3 className="text-lg font-semibold mb-2 text-dark-green leading-6">¿Ya hiciste el test para medir tu huella de carbono anual?</h3>
                                <p className="mb-4 font-medium">Con este dato, va a ser mucho más divertido usar <strong>reducir</strong>, ya que a medida que vas cumpliendo con tus acciones, tu huella se va reduciendo y podrás verlo.</p>
                                <Link
                                    className="border border-dark-green bg-dark-green text-white cursor-pointer rounded-[30px] flex items-center justify-center shadow-md font-medium text-sm py-2 px-4 h-[42px] w-full"                                 
                                    to="/test/intro">Realizar test</Link>
                            </>   
                        :
                            <>
                                <h3 className="text-lg font-semibold mb-4 text-dark-green leading-6">Establecé una <strong>meta anual</strong> para <strong>generar un cambio enorme</strong> en el <strong>planeta</strong>.</h3>
                                <div>
                                    <Link
                                        className="border border-dark-green bg-dark-green text-white cursor-pointer rounded-[30px] flex items-center justify-center shadow-md font-medium text-sm py-2 px-4 h-[42px] w-full" 
                                        to={"/app/emissions/goals"}>Establecer meta</Link>
                                </div>
                            </>
                        }
                    </div>                    
                    :
                    <GoalProgressCard 
                        targetReductionPercentage={userData?.carbonGoal?.targetReductionPercentage}
                        baselineValue={userData?.carbonGoal?.baselineValue}
                        targetValue={userData?.carbonGoal?.targetValue}
                        currentCarbon={userData?.carbon}
                        startDate={userData?.carbonGoal?.startDate}
                        year={userData?.carbonGoal?.year}
                        isOwnProgress={isOwnProfile}
                    />
                }
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

                <BaseCarousel>
                    {/* TODO: USE SWIPER */}
                    {/* {isLoading && <p>Cargando acciones favoritas...</p>} */}
                    {/* {isError && <p>Error al cargar las acciones.</p>} */}
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
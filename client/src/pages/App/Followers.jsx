import { Link, useParams } from "react-router-dom";
import { useGetFollowersQuery } from "../../api/followSlice";
import { useState } from "react";
import { Search } from "../../components/Inputs/Search";
import { Loader } from "../../components/Base/Loader";

//todo: hacer un componente reutilizable para FOllowers y Following porque son iguales
export function Followers() {
  const { userId } = useParams();
  const { data: followersData, isLoading: isLoadingFollowers, isError: isErrorFollowers } = useGetFollowersQuery({ userId, page: 1, limit: 10 }, { skip: !userId });

  // todo: agregar logica para esperar a hacer el filtro
  const [searchTerm, setSearchTerm] = useState('');
  const filteredFollowers = followersData?.filter((user) =>
    user?.follower?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.follower?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="">
      <div className="w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 mt-4 border-b border-gray-200">
          {/* boton para ir atras */}
          <Link className="" to={`/app/home/${userId}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </Link>          
          <h2 className="text-xl font-semibold">Seguidores</h2>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search 
              placeholder="Buscar usuarios..."
              onSearch={setSearchTerm}
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoadingFollowers && <Loader />}
          {isErrorFollowers && <p>Error al cargar los seguidores.</p>}
          {filteredFollowers?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No se encontraron usuarios
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFollowers?.map((user) => (
                <Link to={`/app/home/${user.follower?._id}`}
                  key={user.follower?._id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursos-pointer"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                      src={user.follower?.image}
                      alt={user.follower?.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate">
                        {user.follower?.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {user.follower?.username}
                      </p>
                    </div>
                  </div>

                  {/* <button
                    onClick={() => handleUnfollow(user.id)}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 px-4 py-2 rounded-full transition-colors flex-shrink-0 ml-2"
                  >
                    <UserMinus size={16} />
                    <span className="text-sm font-medium">Siguiendo</span>
                  </button> */}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer con contador */}
        {filteredFollowers !== undefined &&
          <div className="p-4 border-t border-gray-200 text-center text-sm text-gray-500">
            {filteredFollowers?.length} {filteredFollowers?.length === 1 ? 'usuario' : 'usuarios'}
          </div>
        }
      </div>
    </div>
  );
}
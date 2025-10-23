import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useCreateUserMutation, useLoginUserMutation } from '../api/apiSlice';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../utils/axios';
import { toast } from 'sonner';

const AuthContext = createContext();

export default AuthContext;


export const AuthProvider = ({ children }) => { 
  const navigate = useNavigate();

  const [loginUser] = useLoginUserMutation();
  const [createUser] = useCreateUserMutation();

  const [user, _setUser] = useState();
  const [userId, setUserId] = useState();
  const [accessToken, setAccessToken] = useState();
  const [loading, setLoading] = useState(true);

  /**
   * Establece el usuario en el estado de forma segura,
   * eliminando la propiedad 'password' antes de guardarlo.
   */
  const setUser = (userData) => {
    if (userData) {
      const { password, ...safeUser } = userData;
      _setUser(safeUser);
    } else {
      _setUser(null);
    }
  };

    // ✅ Extraer fetchAccessToken como función independiente
  const fetchAccessToken = async () => {
    try {
      const response = await axios.post(`${baseURL}/tokens`, {}, {
        withCredentials: true
      });
      console.log("response fetchAccessToken", response);

      setAccessToken(response?.data?.accessToken);
      setUserId(response?.data?.userId);
      setUser(response?.data?.user);
      
      return response?.data; // Retornar los datos
    } catch (error) {        
      setAccessToken(null);
      setUserId(null);
      setUser(null);
      throw error; // Re-lanzar el error si falla
    }
  };

  const handleRegister = async (data) => {
    const { name, username, email, password } = data;

    try {
      const response = await createUser({ 
        name,
        username,
        email,
        password
      }).unwrap(); 
      
      if (response) {
        setAccessToken(response.accessToken);        
        setUserId(response?.userId);
        //TODO: cambiar esto porque no guarda nada, ver si eliminarlo directamente la logica de guardar user en authContext
        setUser(response?.data?.user);
        
        await fetchAccessToken();

        navigate(`/test/intro`, { replace: true });
      }

      return false; 
    } catch (error) {
      const errorMessage = error.data || "Ocurrió un error inesperado. Inténtalo de nuevo.";
      toast.error(errorMessage, {
        duration: Infinity,
        closeButton: true,
        style: {
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'center',
          borderRadius: '20px',
          border: '1px solid #f87171',
          fontFamily: 'Inter, sans-serif',
        }
      });
      return false;
    }
  }

  const handleLogin = async (data) => {
    const { email, password } = data;

    try {
      const response = await loginUser({ 
        email, 
        password 
      }).unwrap(); 
      
      if (response) {
        setAccessToken(response?.accessToken);
        setUserId(response?.user?._id);
        setUser(response?.user);

        await fetchAccessToken();

        navigate(`/app/home/${response?.user?._id}`, { replace: true });
      }

      return false; 
    } catch (error) {
      const errorMessage = error.data || "Email o contraseña incorrectos.";
      toast.error(errorMessage, {
        duration: Infinity,
        closeButton: true,
        style: {
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'center',
          borderRadius: '20px',
          border: '1px solid #f87171',
          fontFamily: 'Inter, sans-serif',
        }
      });
      return false;
    }
  }

  const handleLogout = () => {
    try {
      axios.post(`${baseURL}/users/logout`, {}, {
        withCredentials: true
      });
      setAccessToken(null);
      setUserId(null);
      setUser(null);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }
  
  // ✅ Llamar fetchAccessToken al cargar la app
  useEffect(() => {    
    const initAuth = async () => {
      try {
        await fetchAccessToken();
      } catch {
        // Error ya manejado en fetchAccessToken
      } finally {
        setLoading(false); 
      }
    };

    initAuth();
  }, []);


  return(
    <AuthContext.Provider value={{ accessToken, userId, user, setUser, setAccessToken, handleRegister, handleLogin, handleLogout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}
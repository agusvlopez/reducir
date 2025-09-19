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

  const [user, setUser] = useState();
  const [userId, setUserId] = useState();
  const [accessToken, setAccessToken] = useState();
  const [loading, setLoading] = useState(true);

  const handleRegister = async (data) => {
    const { name, username, email, password } = data;

    try {
      const response = await createUser({ 
        name,
        username,
        email,
        password
      }).unwrap(); 

      const token = response?.data?.accessToken;
 
      if (token) {
        setAccessToken(token);        
        setUserId(response?.data?.userId);
        setUser(response?.data?.user);
        navigate('/app/home', { replace: true });
      }
    } catch (error) {
      console.error("Error al registrarse:", error);
      // Extraemos el mensaje de error de la respuesta de la API
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
    }
  }

  const handleLogin = async (data) => {
    const { email, password } = data;

    try {
      const response = await loginUser({ 
        email, 
        password 
      }).unwrap(); 

      const token = response?.accessToken;     

      if (token) {
        setAccessToken(token);
        setUserId(response?.userId);
        setUser(response?.user);
        navigate('/app/home', { replace: true });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
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
  
  useEffect(() => {    
    const fetchAccessToken = async () => {
      try {
        const response = await axios.post(`${baseURL}/tokens`, {}, {
          withCredentials: true
        });

        setAccessToken(response?.data?.accessToken);
        setUserId(response?.data?.userId);
        setUser(response?.data?.user);
        
      } catch {        
        setAccessToken(null);
        setUserId(null);
        setUser(null);
      } finally {
        setLoading(false); 
      }
    }

    fetchAccessToken();
  }, []);


  return(
    <AuthContext.Provider value={{ accessToken, userId, user, setUser, setAccessToken, handleRegister, handleLogin, handleLogout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}
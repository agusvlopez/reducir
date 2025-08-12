import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useCreateUserMutation, useLoginUserMutation } from '../api/apiSlice';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../utils/axios';


const AuthContext = createContext();

export default AuthContext;


export const AuthProvider = ({ children }) => { 
  const navigate = useNavigate();

  const [loginUser] = useLoginUserMutation();
  const [createUser] = useCreateUserMutation();

  const [accessToken, setAccessToken] = useState();
  const [loading, setLoading] = useState(true);

  const handleRegister = async (data) => {
    const name = data.name;
    const username = data.username;
    const email = data.email;
    const password = data.password;

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
        navigate('/app/home', { replace: true });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      // TODO: Handle error, e.g., show a message to the user
    }
  }

  const handleLogin = async (data) => {
    const email = data.email;
    const password = data.password;

    if (!email || !password) {
      console.log("Email y contraseña son requeridos");
      // TODO: Handle error, e.g., show a message to the user
      return;
    }

    try {
      const response = await loginUser({ 
        email, 
        password 
      }).unwrap(); 

      const token = response?.accessToken;     

      if (token) {
        setAccessToken(token);
        navigate('/app/home', { replace: true });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  }

  const handleLogout = () => {
    try {
      axios.post(`${baseURL}/users/logout`, {}, {
        withCredentials: true
      });
      setAccessToken(null);
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
      } catch (error) {        
        setAccessToken(null);
      } finally {
        setLoading(false); 
      }
    }

    fetchAccessToken();
  }, []);


  return(
    <AuthContext.Provider value={{ accessToken, setAccessToken, handleRegister, handleLogin, handleLogout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}
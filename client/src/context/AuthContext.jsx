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

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      console.log("Las contraseñas no coinciden");
      // Handle error, e.g., show a message to the user
      return;
    }

    try {
      const response = await createUser({ 
        name,
        username,
        email,
        password
      });

      if(response.error) {
        console.error("Error al registrar el usuario:", response.error);
        // Handle error, e.g., show a message to the user
        return; 
      }
      
      const token = response?.data?.accessToken;
 
      if (token) {
        setAccessToken(token);
        navigate('/app/home', { replace: true });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      // Handle error, e.g., show a message to the user
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      console.log("Email y contraseña son requeridos");
      // TODO: Handle error, e.g., show a message to the user
      return;
    }

    try {
      const response = await loginUser({ email, password }).unwrap(); //todo: CHECK unwrap
      const token = response?.accessToken;     
      console.log('token', token);

      if (token) {
        setAccessToken(token);
        navigate('/app/home', { replace: true });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  }

  const handleLogout = () => {
    setAccessToken(null);
    //TODO: CALL BACKEND TO LOGOUT
    navigate('/login', { replace: true });
  }
  
  useEffect(() => {    
    const fetchAccessToken = async () => {
      console.log("Verificando sesión activa...");
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
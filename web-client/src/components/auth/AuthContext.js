// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const AuthContext = createContext();
export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [cookies, removeCookie] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate('/login');
        setUser(null);
        return;
      }

      try {
        const response = await fetch('http://localhost:3030/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { status, admin } = await response.json();

        if (!status) {
          removeCookie('token');
          navigate('/login');
          return;
        }

        setUser({ admin });
      } catch (error) {
        console.error(error);
      }
    };

    verifyCookie();
  }, [cookies.token, navigate, removeCookie]);

  const login = (userData) => {
    // Perform your login logic and set user data
    setUser(userData);
  };

  const logout = () => {
    // Perform your logout logic and clear user data
    removeCookie('token');
    setUser(null);
  };

  useEffect(() => {
    if (user === null) {
        navigate('/login');
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};



import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';



const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const {user} = useAuth();
    console.log('user is: ', user);

    if (!user || user.admin === undefined) {
      navigate('/login');
      return null;
    }
  
    return children;
  };

  export default ProtectedRoute;
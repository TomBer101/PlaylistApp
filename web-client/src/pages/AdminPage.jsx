import React, { useState, createContext, useContext, useEffect } from "react";
import PlaylistsList from '../components/adminPage/PlaylistsList';
import QRDisplay from "../components/adminPage/QRDisplay";
import { useAuth } from '../components/auth/AuthContext';
import '../styles/adminPage/AdminPage.css';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const AdminContext = createContext();
export const useAdminContext = () => {
    return useContext(AdminContext);
}

function AdminPage() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const {user, logout} = useAuth();
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies();
  
  const [userplaylist, setUserPlaylist] = useState(null);

  if (!user) {
    navigate("/");
    return null;
  }

  useEffect(() => {
    if (user) {
      setUserPlaylist(user.playlistId);
    }
  }, [])

  // useEffect(() => {
  //   const verifyCookie = async () => {
  //     if (!cookies.token) {
  //       navigate("/login");
  //     }

  //     const response = await fetch("http://localhost:3030/", {
  //       method: 'POST', 
  //       headers:{
  //           'Content-Type': 'application/json',
  //       },
  //       credentials: 'include',
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //   }

  //     const { status, admin, playlistId } = await response.json();
  //     if (!status) {
  //       return (removeCookie("token"), navigate("/login"));
  //     }
        
  //   };
  //   verifyCookie();
  // }, [cookies, navigate, removeCookie]);

  
  const Logout = () => {
    removeCookie("token");
    navigate("/signup");
  };

  if (!cookies.token) {
    return null; // Return null when user is not authorized
  }

  const adminContextValue = {
    baseUrl: 'http://localhost:3030/api/admin', // TODO: localhost should be changed to relevant url
  };

  return (
    <AdminContext.Provider value={adminContextValue}>
      <div className="admin-page">
        <h1 className="title">Tester</h1>
        <PlaylistsList  
          setSelectedPlaylist={setSelectedPlaylist} 
          fetchDataIndicator={userplaylist}
        />
        <QRDisplay  
          setSelectedPlaylist={setSelectedPlaylist} 
          selectedPlaylist={selectedPlaylist} 
          setUserPlaylist={setUserPlaylist}
          userplaylist={userplaylist}
        />
        <button onClick={logout}>LOGOUT</button>
      </div>
    </AdminContext.Provider>

  );
}

export default AdminPage;
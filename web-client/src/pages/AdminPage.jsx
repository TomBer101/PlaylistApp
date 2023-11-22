import React, { useState, createContext, useContext, useEffect } from "react";
import PlaylistsList from '../components/adminPage/PlaylistsList';
import QRDisplay from "../components/adminPage/QRDisplay";
import '../styles/adminPage/AdminPage.css';

const AdminContext = createContext();
export const useAdminContext = () => {
    return useContext(AdminContext);
}

function AdminPage() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [createdQR, setCreatedQR] = useState(null);

  
  console.log('created qr: ', createdQR);
  console.log('selected from admin page: ', selectedPlaylist);
  const adminContextValue = {
    baseUrl: process.env.REACT_APP_SERVER + '/api/admin', 
    selectedPlaylist: selectedPlaylist,
    createdQR: createdQR,
  };

  return (
    <AdminContext.Provider value={adminContextValue}>
      <div className="admin-page">
        <div className="title">
          <h1 >Welcome</h1>
          <h5>Welcome to the admin page. Here you can generate QR code, and test my app.</h5>
        </div>

        <PlaylistsList 
          setCreatedQR={setCreatedQR}
          setSelectedPlaylist={setSelectedPlaylist}
        />
        <QRDisplay  
          setCreatedQR={setCreatedQR}
          setSelectedPlaylist={setSelectedPlaylist}
        />
      </div>
    </AdminContext.Provider>

  );
}

export default AdminPage;
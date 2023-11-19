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
  const [fetchIndicator, setFetchIndicator] = useState(false);
  const [createdQR, setCreatedQR] = useState(null);

  const toggleIndicator = () => {
    setFetchIndicator(!fetchIndicator);
  }
  
  console.log('created qr: ', createdQR);
  console.log('selected from admin page: ', selectedPlaylist);
  const adminContextValue = {
    baseUrl: process.env.REACT_APP_SERVER + '/api/admin', //'http://localhost:3030/api/admin', // TODO: localhost should be changed to relevant url
    selectedPlaylist: selectedPlaylist,
    createdQR: createdQR,
  };

  return (
    <AdminContext.Provider value={adminContextValue}>
      <div className="admin-page">
        <div className="title">
          <h1 >Welcome</h1>
          <h5>Welcome to the admin page. Here you can generate QR code, and text my app.</h5>
        </div>

        <PlaylistsList 
          setCreatedQR={setCreatedQR}
          setSelectedPlaylist={setSelectedPlaylist}
          //setSelectedPlaylist={setSelectedPlaylist} 
          // selectedPlaylist={selectedPlaylist}
        />
        <QRDisplay  
          setCreatedQR={setCreatedQR}
          setSelectedPlaylist={setSelectedPlaylist}
          //setSelectedPlaylist={setSelectedPlaylist} 
          //selectedPlaylist={selectedPlaylist} 
        />
      </div>
    </AdminContext.Provider>

  );
}

export default AdminPage;
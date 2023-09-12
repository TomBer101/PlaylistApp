import React, { useState, createContext, useContext } from "react";
import PlaylistsList from '../components/adminPage/PlaylistsList';
import QRDisplay from "../components/adminPage/QRDisplay";
import '../styles/adminPage/AdminPage.css';

const AdminContext = createContext();
export const useAdminContext = () => {
    return useContext(AdminContext);
}

function AdminPage() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const adminContextValue = {
    baseUrl: 'http://localhost:3030/api/admin', // TODO: localhost should be changed to relevant url
  };

  return (
    <AdminContext.Provider value={adminContextValue}>
      <div className="admin-page">
        <h1 className="title">Tester</h1>
        <PlaylistsList  setSelectedPlaylist={setSelectedPlaylist} />
        <QRDisplay  setSelectedPlaylist={setSelectedPlaylist} selectedPlaylist={selectedPlaylist} />
      </div>
    </AdminContext.Provider>

  );
}

export default AdminPage;
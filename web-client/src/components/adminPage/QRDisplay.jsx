import React, { useEffect, useState } from "react";
import { useAdminContext } from "../../pages/AdminPage";
import { useAuth } from '../../components/auth/AuthContext';
import '../../styles/adminPage/QrDisplay.css';


function QRDisplay({selectedPlaylist, setSelectedPlaylist, setUserPlaylist, userplaylist}) {
    const [qrCode, setQRCode] = useState('');
    const {baseUrl} = useAdminContext();
    const {user} = useAuth();

    useEffect(() => {
        if (selectedPlaylist != null) {
            setQRCode(selectedPlaylist.qr);
            console.log('Displayd QR: ', selectedPlaylist);
        }
    }, [selectedPlaylist]);

    const handleGenerateQRClick = async () => {
        if (!userplaylist) {
            setSelectedPlaylist(null);
            try {
                const response = await fetch(`${baseUrl}create/${user.admin}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    throw new Error("Failed to generate QR playlist");
                }
    
                const data = await response.json();
                console.log(data);
                setQRCode(data.code);
                setUserPlaylist(data.playlistId)
            } catch (error) {
                console.error('Error generating QR code: ', error);
            }
        } else {
            alert("You already have a playlist in the system. Please, first delete the current one.");
        }
    }

    const handleDeleteOnClick = async () => {
        if (userplaylist) {
            try {
                const response = await fetch(`${baseUrl}delete/${userplaylist}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: { adminId: user.admin}
                });

                if (!response.ok) {
                    throw new Error("Failed to delete playlist");
                }

                setQRCode(null);
                setUserPlaylist(null);
            }
            catch (err) {
            console.log('Error deleiting playlist: ', err);
        }
    }
    }

    // TODO: fetch all playlists again?
    return (
        <div className="qr-container">
            <h2>QR Code</h2>
            <div className="qr-code">
                {qrCode? <img src={qrCode} alt='QR code'/> : 'No QR code generated'}
                {selectedPlaylist? <p className="playlist-name">{selectedPlaylist.name}</p> : null}
            </div>
            <div className="button-container">
                <button onClick={handleGenerateQRClick}>Generate</button> 
                <button 
                    onClick={handleDeleteOnClick} 
                    disabled={selectedPlaylist && selectedPlaylist.id != userplaylist}
                    style={{backgroundColor:'red'}} >
                        Delete
                </button>
            </div>
        </div>
    )

}

export default QRDisplay;
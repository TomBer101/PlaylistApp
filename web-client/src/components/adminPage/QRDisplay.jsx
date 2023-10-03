import React, { useEffect, useState } from "react";
import { useAdminContext } from "../../pages/AdminPage";
import '../../styles/adminPage/QrDisplay.css';


function QRDisplay({selectedPlaylist, setSelectedPlaylist, alertFetch}) {
    const [qrCode, setQRCode] = useState('');
    const {baseUrl} = useAdminContext();

    useEffect(() => {
        if (selectedPlaylist != null) {
            setQRCode(selectedPlaylist.qr.qrCode);
            console.log('Displayd QR: ', selectedPlaylist);
        }
    }, [selectedPlaylist]);

    const handleGenerateQRClick = async () => {
            try {
                const response = await fetch(`${baseUrl}/create`, {
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
                alertFetch();
            } catch (error) {
                console.error('Error generating QR code: ', error);
            }
    }

    
    return (
        <div className="qr-container">
            <h2>QR Code</h2>
            <div className="qr-code">
                {qrCode? <img src={qrCode} alt='QR code'/> : 'No QR code generated'}
                {selectedPlaylist? <p className="playlist-name">{selectedPlaylist.name}</p> : null}
            </div>
            <div className="button-container">
                <button onClick={handleGenerateQRClick}>Generate</button> 
            </div>
        </div>
    )

}

export default QRDisplay;
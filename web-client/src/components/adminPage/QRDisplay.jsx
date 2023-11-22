import React, { useEffect, useState } from "react";
import { useAdminContext } from "../../pages/AdminPage";
import '../../styles/adminPage/QrDisplay.css';


function QRDisplay({setCreatedQR, setSelectedPlaylist}) {
    const [qrCode, setQRCode] = useState('');
    const {baseUrl, selectedPlaylist, createdQR} = useAdminContext();
    const [currentColor, setCurrentColor] = useState(0);

    const colors = ['#FFBB5C', '#45FFCA', '#D67BFF', '#EA1179', '#A555EC']

    useEffect(() => {
        if (selectedPlaylist != null) {
            setQRCode(selectedPlaylist.qr); 
        } else if (createdQR != null) {
            setQRCode(createdQR.code)
        }
        setCurrentColor(prevColor => {
            if (prevColor === colors.length - 1) return 0;
            return (prevColor + 1);
        });
    }, [selectedPlaylist, createdQR]);



    const handleGenerateQRClick = async () => {
        if (!createdQR){
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
                setCreatedQR({
                    id: data.playlistId,
                    code: data.code,
                });
                setSelectedPlaylist(null);
            } catch (error) {
                console.error('Error generating QR code: ', error);
            }
        } else {
            alert('You did not finish to edit your previous playlist!');
        }

    }

    const showMyQr = () => {
        setSelectedPlaylist(null);
        setQRCode(createdQR.code)
    }


    const borderStyle = {
        borderRadius:'10px',
        color:colors[currentColor],
        boxShadow: '0px 2px 14px 2px' + colors[currentColor],
    }
    
    return (
        <div className="qr-container" style={ borderStyle} >
                <h2 >{selectedPlaylist && selectedPlaylist.name != ''?selectedPlaylist.name: ' '}</h2>

            <div className="qr-code" >
                {qrCode? <img src={qrCode} alt='QR code'/> : 'No QR code generated'}
            </div>
            <div className="button-container" >
                <button onClick={handleGenerateQRClick}>Generate</button> 
                {createdQR && <button onClick={showMyQr} >Show My QR</button>}
            </div>
        </div>
    )

}


export default QRDisplay;
import React, { useState } from 'react';
import { useAdminContext } from "../../pages/AdminPage";
import '../../styles/adminPage/PlaylistBlock.css';

function PlaylistBlock({playlistInfo, setSelectedPlaylist}) {
    //const [playlistId, setPlaylistId] = useState()
    const {baseUrl} = useAdminContext();


    const handlePlaylistSelected = async () => {
        try {
            const response = await fetch(`${baseUrl}/qr-code/${playlistInfo._id}`);
            if (!response) throw new Error('Failed to get playlist');

            const data = await response.json();
            console.log('fetced data: ', data);
            setSelectedPlaylist({
                id: playlistInfo._id,
                qr: data, 
                name: playlistInfo.name
            });
        } catch (error) {
            console.error('Error fetching playliat data: ', error);
        }
    };

    return (
        <li className='playlist-box' onClick={handlePlaylistSelected}>
            <div className='img-container'><img alt='cover-image' src={playlistInfo.coverImage}></img></div>
            <div className='name-container'>{playlistInfo.name}</div>
        </li>
    );
}

export default PlaylistBlock;
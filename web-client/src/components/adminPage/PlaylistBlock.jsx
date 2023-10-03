import React, { useState, useEffect } from 'react';
import { useAdminContext } from "../../pages/AdminPage";
import '../../styles/adminPage/PlaylistBlock.css';

function PlaylistBlock({playlistInfo, setSelectedPlaylist}) {
    //const [playlistId, setPlaylistId] = useState()
    const [imgSrc, setImgSrc] = useState(null);
    const {baseUrl} = useAdminContext();

    useEffect(() => {
        if (playlistInfo.coverImage.startsWith('/uploads-')) {
            const imageSrc = baseUrl.split('/api')[0]+'/uploads/' + playlistInfo.coverImage;
            setImgSrc(imageSrc);
        } else {
            setImgSrc(playlistInfo.coverImage);
        }
    }, []);


    const handlePlaylistSelected = async () => {
        try {
            const response = await fetch(`${baseUrl}/qr-code/${playlistInfo._id}`);
            if (!response) throw new Error('Failed to get playlist');
            console.log('Response id: ', response);
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
            <div className='img-container'><img alt='cover-image' src={imgSrc}></img></div>
            <div className='name-container'>{playlistInfo.name}</div>
        </li>
    );
}

export default PlaylistBlock;
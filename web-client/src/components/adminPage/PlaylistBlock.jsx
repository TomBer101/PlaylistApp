import React, { useState, useEffect } from 'react';
import { useAdminContext } from "../../pages/AdminPage";
import '../../styles/adminPage/PlaylistBlock.css';

function areEqual(prevProps, nextProps) {
    return (
      prevProps.playlistInfo._id === nextProps.playlistInfo._id &&
      prevProps.playlistInfo.name === nextProps.playlistInfo.name &&
      prevProps.playlistInfo.coverImage === nextProps.playlistInfo.coverImage &&
      prevProps.playlistInfo.name === nextProps.playlistInfo.name
    );
}

function PlaylistBlock({playlistInfo, setSelectedPlaylist}) {
    const [imgSrc, setImgSrc] = useState(null);
    const {baseUrl, selectedPlaylist} = useAdminContext();

    console.log('Rendering playlist Block: ', playlistInfo.name);

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
            console.log('Selected before: ', selectedPlaylist);
            setSelectedPlaylist({
                id: playlistInfo._id,
                qr: data, 
                name: playlistInfo.name
            });
            console.log('Selected after: ', selectedPlaylist);
        } catch (error) {
            console.error('Error fetching playliat data: ', error);
        }
    };


    return (
        <li className='playlist-box' onClick={handlePlaylistSelected} 
            style={selectedPlaylist && selectedPlaylist.id === playlistInfo._id? {boxShadow: '0px 0px 5px 3px #316f79'} : {}}>
            <div className='img-container'><img alt='cover-image' src={imgSrc}></img></div>
            <div className='name-container'>{playlistInfo.name}</div>
        </li>
    );
}

export default React.memo(PlaylistBlock, areEqual);



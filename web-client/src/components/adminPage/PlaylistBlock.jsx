import React, { useState, useEffect } from 'react';
import { useAdminContext } from "../../pages/AdminPage";
import '../../styles/adminPage/PlaylistBlock.css';

function PlaylistBlock({playlistInfo, setSelectedPlaylist}) {
    //const [playlistId, setPlaylistId] = useState()
    const [imgSrc, setImgSrc] = useState(null);
    const {baseUrl, selectedPlaylist} = useAdminContext();

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

    console.log('Selected after 2: ', selectedPlaylist);

    return (
        <li className='playlist-box' onClick={handlePlaylistSelected} 
            style={selectedPlaylist && selectedPlaylist.id === playlistInfo._id? {boxShadow: '0px 0px 5px 3px #316f79'} : {}}>
            <div className='img-container'><img alt='cover-image' src={imgSrc}></img></div>
            <div className='name-container'>{playlistInfo.name}</div>
        </li>
    );
}

export default PlaylistBlock;

//box-shadow: 0px 0px 5px 3px black;
//(selectedPlatlist && selectedPlatlist.id === playlistInfo._id)? {backgroundColor: '#64CCC5'} : {}

//

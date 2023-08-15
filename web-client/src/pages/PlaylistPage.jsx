// 1. text input
// 2. image - defualt image. when clicked an images collections will be open with an option to upload an image.
// 3. 3 song slots. 

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Title from '../components/Title';
import Image from '../components/Image';
import '../styles/PlaylistPage.css';
import getLocalIPAddress from '../utils/getLocalIp';

const PlaylistContext = createContext();
export const usePlaylistContext = () => {
    return useContext(PlaylistContext);
}

function PlaylistPage() {
    const [playlistData, setPLaylistData] = useState(null);
    //const [playlistId, setPlaylistId] = useState(null);
    //const [baseUrl, setBaseUrl] = useState('');
    const location = useLocation();

    async function fetchPlaylistData(decodedUrl)  {
        try {
            const response = await fetch(decodedUrl);
            const data = await response.json();
            setPLaylistData(data);

            // const idFromUrl = decodedUrl.split('/').pop(); // alternative way: id in the data
            // setPlaylistId(idFromUrl);
        } catch (error) {
            console.error('Error fetching playlist data: ', error);
        }
    };

    let playlistContextValue;

    // useEffect(() => {
    //     playlistContextValue = {
    //         playlistId: 
    //     }
    // })

    // useEffect(() => {
    //     const encodedUrl = location.pathname.substring(1);
    //     const decodedUrl = decodeURIComponent(encodedUrl);

    //     const base = decodedUrl.split('/playlists')[0] + '/playlists';
    //     const playlistId = decodedUrl.split('/').pop();

    //     playlistContextValue = {
    //         playlistId: playlistId,
    //         baseUrl: base,
    //         editing: playlistData.pageType === "creator",
    //     };

    //     //setBaseUrl(base);
    //     fetchPlaylistData(decodedUrl);

    // }, [location]);

  return (
    <PlaylistContext.Provider value={playlistContextValue}>
        <div className="playlist-page-container">
            <Title />
            <Image />
            {/*image section
            3 song searching */}
        </div>
    </PlaylistContext.Provider>
  );
}

export default PlaylistPage;
import React, { useState, useEffect, createContext, useContext } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Title from '../components/playlistPage/Title';
import Image from '../components/playlistPage/Image';
import Player  from '../components/playlistPage/Player';
import '../styles/playlistPage/PlaylistPage.css';

const PlaylistContext = createContext();
export const usePlaylistContext = () => {
    return useContext(PlaylistContext);
}


function PlaylistPage() {
    const [playlistData, setPLaylistData] = useState(null);
    const [context, setContext] = useState(false);
    //const {playlistId} = useParams();
    const location = useLocation();

    useEffect(() => {
      //const url = window.location.href;
      //const ipMatch = url.match(/http:\/\/([\d.]+)/);
      const searchParams = new URLSearchParams(window.location.search);
      console.log(searchParams);
      const playlistIdParam = searchParams.get('playlistId'); 
      if (playlistIdParam) {
        console.log('playlist id: ', playlistIdParam);
          const base = `http://localhost:3030/api/playlists`;
          fetchPlaylistData(base, playlistIdParam);
      }
  }, []);


  const fetchPlaylistData = async (base, playlistId) => {
    try {
      const response = await fetch(base + '/scanned/' + playlistId);
      const data = await response.json();
      console.log('fetced data:',data);
      setPLaylistData({ ...data, base: base });
    } catch (error) {
      console.error('Error fetching playlist data: ', error);
    }
  };



    // async function fetchPlaylistData(decodedUrl)  {
    //     try {
    //         const response = await fetch(decodedUrl);
    //         const data = await response.json();
    //         setPLaylistData(data);
    //     } catch (error) {
    //         console.error('Error fetching playlist data: ', error);
    //     }
    // };
 
    // useEffect(() => {

    //     fetch('https://api.ipify.org?format=json')
    //     .then(response => response.json())
    //     .then(data => {
    //         setMyIp(data.ip);
    //         console.log('The ip from ipify: ', myIp);
    //         const base = `http://192.168.1.184:3030/api/playlists`;
    //         const playlistId = "64beaf706259698a8f4af2aa";
    //         fetchPlaylistData(base, playlistId);
    //     })
    //     .catch(error => console.log('error fetching ip: ', error));
    // }, []);



    // useEffect(() => {
    //     const fetchPlaylistData = async () => {
    //         try {

    //             const encodedUrl = location.pathname.substring(1);
    //             const decodedUrl = decodeURIComponent(encodedUrl);
    //             const base = decodedUrl.split('/playlists')[0] + '/playlists';
    //             const playlistId = decodedUrl.split('/').pop();
    //             const response = await fetch(decodedUrl);
    //             const data = await response.json();

    //             //'Local' testing
    //             // base = `http://${myIp}:3030/api/playlists`;
    //             // const playlistId = "64beaf706259698a8f4af2aa";
    //             // const response = await fetch(base + '/scanned/' + playlistId);
    //             // const data = await response.json();
    //             // console.log(data);
    //             // setPLaylistData({...data, base: base });
    //         } catch (error) {
    //             console.error('Error fetching playlist data: ', error);
    //         }

    //     }

    //     fetchPlaylistData();

    // }, [location, myIp]);

    useEffect(()=>{
      const playlistContextValue = {
        playlistId: playlistData? playlistData.id : null,
        baseUrl: playlistData?playlistData.base: null,
        editing: (playlistData && playlistData.pageType === 'creator'),
        ip: new URLSearchParams(window.location.search).get('ip'),
    };

    setContext(playlistContextValue);
    }, [playlistData]);


    const savePlaylist = async () => {
      try {
        const response = await fetch(context.baseUrl + '/save/' + context.playlistId, {
          method: 'POST',
        });
        const data = await response.json();
        console.log('Playlist was saved to DB: ',data);
        setContext({...context, editing:false});
      } catch (error) {
        console.error('Error fetching playlist data: ', error);
      }
    }

    console.log('playlist context: ', context);

  return (
    <PlaylistContext.Provider value={context}>
        <div className="playlist-page-container">
            <Title name={playlistData? playlistData.data.name : ''}/>
            <Image  imageName={playlistData? playlistData.data.coverImage : ''}/>
            <Player  />
            <div className='save-button'>
              <button  onClick={savePlaylist} hidden={context && !context.editing} >Done!</button>
            </div>
        </div>
    </PlaylistContext.Provider>
  );
}

export default PlaylistPage;
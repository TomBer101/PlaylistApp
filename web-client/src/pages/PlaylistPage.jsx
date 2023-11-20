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
    const location = useLocation();

    useEffect(() => {
      const searchParams = new URLSearchParams(window.location.search);
      console.log(searchParams);
      const playlistIdParam = searchParams.get('playlistId'); 
      if (playlistIdParam) {
        console.log('playlist id: ', playlistIdParam);
          //const base = `http://localhost:3030/api/playlists`;
          const base = process.env.REACT_APP_SERVER + '/api/playlists';
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
      console.log('try to save');
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
            {playlistData && <Image  fileName={playlistData.data.coverImageFileName} type={playlistData.data.coverImageType} imageName={playlistData.data.coverImage}/>}
            <Player  />
            <div className='save-button'>
              <button  onClick={savePlaylist} hidden={context && !context.editing} >Done!</button>
            </div>
        </div>
    </PlaylistContext.Provider>
  );
}

export default PlaylistPage;
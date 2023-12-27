import React, { useState, useEffect, useRef, useCallback } from 'react';
import YouTube, { YouTubePlayer } from 'react-youtube';
import SongBox from './SongBox';
import SongSearchModal from './SongSearchModal';
import { usePlaylistContext } from '../../pages/PlaylistPage';
import '../../styles/playlistPage/Player.css';


function Player() {

  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      mute: false,
    },
  };

  const { playlistId, baseUrl, editing } = usePlaylistContext();
  const [songs, setSongs] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
console.log('====================================');
console.log(`Selected indexs is: ${selectedIndex}`);
console.log('====================================');
  const videoElement = useRef(null);

  useEffect(() => {

    async function fetchSongs() {
      if (playlistId) {
        try {
          const response = await fetch(baseUrl + '/get-songs/' + playlistId);
          const data = await response.json();
          console.log('fetched songs: ', data.songs);
          setSongs(data.songs);
        } catch (error) {
          console.error('Error fetching songs: ', error);
        }
      }
    }

    fetchSongs()
  }, [playlistId])

  useEffect(() => {
    const updateSongs = async () => {
        try {
          const requestBody = JSON.stringify({ songs });
    
          const response = await fetch(`${baseUrl}/update-songs/${playlistId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
          });
          console.log('current songs: ', songs);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const responseData = await response.json();
          console.log(responseData.message); 
        } catch (error) {
          console.error('Error updating songs: ', error);
        }
    }

    if (baseUrl !== undefined && playlistId !== undefined && songs !== null) {
      updateSongs();
    }
  }, [songs, baseUrl, playlistId])




  useEffect(() => {
    if (videoElement.current) {
      if (isPlaying) {
        videoElement.current.playVideo();
      } else {
        videoElement.current.pauseVideo();
      }
    }
  }, [isPlaying, videoElement.current]);

  const handlePlayPause = useCallback(
     songIndex => {
      if (songIndex !== selectedIndex) {
        if (videoElement.current) {
          videoElement.current.pauseVideo();
        }
        setSelectedIndex(songIndex);
        playVideoById(songs[songIndex]);
        setIsPlaying(true);
      } else {
        setIsPlaying(!isPlaying);
      }
    }, [songs, selectedIndex, isPlaying, videoElement.current]
  );

  const playVideoById =  (videoId) => {
    if (videoElement.current) {
      const player = videoElement.current.loadVideoById(videoId);
      if (isPlaying) {
         videoElement.current.playVideo();
      }
    }
  }

  const playNextSong = () => {
    if (selectedIndex < songs.length - 1 && songs[selectedIndex + 1] != null) {
      setSelectedIndex(prevIndex => {
        playVideoById(songs[prevIndex + 1]);
        return (prevIndex + 1);
      });
    } else {
      setSelectedIndex(0);
    }
  };

  const onReady = (event) => {
    videoElement.current = event.target;
    videoElement.current.loadVideoById(songs[0]);
    if (isPlaying) {
      videoElement.current.playVideo();
    }
  }

  const handleChoosingSong = (youtubeId) => {
    if (selectedIndex !== undefined && selectedIndex !== -1) {
      setSongs((oldSongs) => {
        const newSongs = [...oldSongs];
        newSongs[selectedIndex] = youtubeId;
        return newSongs;
      });
    }
  }


  const selectSongBox = useCallback(
    (index) => {
      if (editing) {
        setSelectedIndex(index);
        setModalVisible(true);
      }
    }, [editing]
  )



  const removeSong = useCallback(
    (songId) => {
      setSongs(oldSongs => oldSongs.filter(song => song != songId))
    }, [songs]
  )

  return ( songs &&
    <div className='player-container player'>
      <SongBox key={1} handleDelete={removeSong} songId={songs[0]} isPlaying={(selectedIndex === 0) && isPlaying}
        handleClick={() => selectSongBox(0)} onClickPlay={() => handlePlayPause(0)} />

      <SongBox key={2} handleDelete={removeSong} songId={songs[1]} isPlaying={(selectedIndex === 1) && isPlaying}
        handleClick={() => selectSongBox(1)} onClickPlay={() => handlePlayPause(1)} />

      <SongBox key={3} handleDelete={removeSong} songId={songs[2]} isPlaying={(selectedIndex === 2) && isPlaying}
        handleClick={() => selectSongBox(2)} onClickPlay={() => handlePlayPause(2)} />

      { <SongSearchModal isVisible={isModalVisible} setIsVisible={setModalVisible} handleSongChosing={handleChoosingSong} />}      <YouTube
        opts={opts}
        onReady={onReady}
        onEnd={playNextSong}
        
      
      />
    </div>

  )

}


export default Player;






import React, { useState, useEffect, useRef } from 'react';
import YouTube, {YouTubePlayer} from 'react-youtube';
import SongBox from './SongBox';
import SongSearchModal from '../../components/playlistPage/SongSearchModal';
import { usePlaylistContext } from '../../pages/PlaylistPage';
import '../../styles/playlistPage/Player.css';


function Player() {

  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      mute:false,
    },
  };

  const { playlistId, baseUrl, editing } = usePlaylistContext();
  const [songs, setSongs] = useState([]); 
  const [isModalVisible, setModalVisible] = useState(false); 

  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0); // the index of the current playing song in the songs
  // const [optState, setOptState] = useState(opts);

  const videoElement = useRef(null);
  const apiKey = process.env.REACT_APP_KEY;


  useEffect(() => {
    fetchSongs()
  }, [playlistId])

  useEffect(() => {
    console.log('Current Songs: ', songs);
    updateSongs();
  }, [songs])

  async function fetchSongs ()  {
    if (playlistId) {
      try {
        const response = await fetch(baseUrl + '/get-songs/' + playlistId);
        const data = await response.json();
        setSongs(data.songs);
      } catch (error) {
        console.error('Error fetching songs: ', error);
      }
    }
  }

  // useEffect(() => {
  //   opts.videoId = songs[selectedIndex]; // Update the video ID based on currentSongIndex
  // }, [selectedIndex]);

  useEffect(() => {
    if (videoElement.current) {

      const elapsedSeconds = videoElement.current.getCurrentTime();
      const elapsedMilliseconds = Math.floor(elapsedSeconds * 1000);
      const ms = elapsedMilliseconds % 10;
      const min = Math.floor(elapsedMilliseconds / 60000);
      const seconds = Math.floor(
        (elapsedMilliseconds - min * 60000) / 1000
      );

      const formattedCurrentTime = 
        min.toString().padStart(2, '0') + ':' +
        seconds.toString().padStart(2, '0') + ':' +
        ms.toString().padStart(3, '0');

        console.log(formattedCurrentTime);
        if (isPlaying) {
          videoElement.current.playVideo();
        } else {
          videoElement.current.pauseVideo();
        }
    }
  }, [isPlaying, videoElement]);


  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     if(videoElement.current && videoElement.current.getCurrentTime() > 0) {
  //       const elapsed_seconds = videoElement.current.getCurrentTime();
  //       const elapsed_milliseconds = Math.floor(elapsed_seconds * 1000);
  //       const ms = elapsed_milliseconds % 1000;
  //       const min = Math.floor(elapsed_milliseconds / 60000);
  //       const seconds = Math.floor(
  //         (elapsed_milliseconds - min * 60000) / 1000
  //       );
  //       const formattedCurrentTime =
  //         min.toString().padStart(2, "0") +
  //         ":" +
  //         seconds.toString().padStart(2, "0") +
  //         ":" +
  //         ms.toString().padStart(3, "0");

  //       console.log(formattedCurrentTime);

  //       if (videoElement.current.playerInfo.playerState === 1) {
  //         console.log("the video is running");
  //       } else if (videoElement.playerInfo.playerState === 2) {
  //         console.log("the video is paused");
  //       }
  //     }
  //   }, 1000);

    
  //   return () => {
  //     clearInterval(interval);
  //   }

  // }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (videoElement.current && videoElement.current.getCurrentTime() > 0) {
  //       // Check if the video is near the end and prepare for the next song
  //       const duration = videoElement.current.getDuration();
  //       const currentTime = videoElement.current.getCurrentTime();
  //       if (duration - currentTime < 2) {
  //         playNextSong();
  //       }
  //     }
  //   }, 1000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  const playNextSong = () => {
    if (selectedIndex < songs.length - 1 && songs[selectedIndex+1] != null) {
      setSelectedIndex(selectedIndex + 1);
    } else {
      // Optionally, loop back to the first song
      setSelectedIndex(0);
    }
  };

  const onReady = (event) => {
    videoElement.current = event.target;
    videoElement.current.unMute();
  }

  const handleChoosingSong = (youtubeId) => {
    if (selectedIndex !== -1) {
      setSongs((oldSongs) => {
        const newSongs = [...oldSongs];
        newSongs[selectedIndex] = youtubeId;
        return newSongs;
      });
    } 
  }

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
      console.log(responseData.message); // Log the response message
    } catch (error) {
      console.error('Error updating songs: ', error);
    }
  }

  function selectSongBox(index) {
    if (editing) {
      setSelectedIndex(index);
      setModalVisible(true);
      console.log(`SongBox ${index} was clicked.`);
    }
  }

  const togglePause = () => {
    setIsPlaying(!isPlaying);
  }

  useEffect(() => {
    playVideoById(songs[selectedIndex]);
  }, [selectedIndex])

  const handlePlayPause = (songIndex) => {
    console.log("The song that should be playing is: ", songs[selectedIndex]);
    if (!isPlaying) {
      setSelectedIndex(songIndex);
      setIsPlaying(true);
    } else if (songIndex == selectedIndex) {
      setIsPlaying(false);
    } else {
      setSelectedIndex(songIndex);
    }
  }

  const playVideoById = (videoId) => {
    if (videoElement.current) {
      const player = videoElement.current.loadVideoById(videoId);
    }
  }

  const savePlaylist = async () => {
    try {
      const response = await fetch(baseUrl + '/save/' + playlistId);
      const data = await response.json();
      console.log('Playlist was saved to DB: ',data);
    } catch (error) {
      console.error('Error fetching playlist data: ', error);
    }
  }

   function  removeSong (songId)  {
    setSongs(oldSongs => {
      const newSongs = oldSongs.map((song) => {
        if (song === songId) return null;
        return song;
      })
      return newSongs;
    })
  }



    return(
      <div className='player-container player'>
          <SongBox key={1} handleDelete={removeSong} songId={songs[0]} songIndex={0} isPlaying={(selectedIndex==0) && isPlaying} 
            handleClick={() => selectSongBox(0)} onClickPlay={()=>handlePlayPause(0)}/>
          <SongBox key={2} handleDelete={removeSong} songId={songs[1]} songIndex={1} isPlaying={(selectedIndex==1) && isPlaying}
            handleClick={() => selectSongBox(1)} onClickPlay={()=>handlePlayPause(1)}/>
          <SongBox key={3} handleDelete={removeSong} songId={songs[2]} isPlaying={(selectedIndex==2) && isPlaying}
            songIndex={2} handleClick={() => selectSongBox(2)} onClickPlay={()=>handlePlayPause(2)}/>
          <SongSearchModal isVisible={isModalVisible} setIsVisible={setModalVisible} handleSongChosing={handleChoosingSong} />
          <button className='save-button' onClick={savePlaylist} hidden={!editing} >Done!</button>
          <YouTube
            opts={opts}
            videoId={songs[selectedIndex]}
            onReady={onReady}
            onEnd={playNextSong}
          />
      </div>
  
    )

  }


  // useEffect(() => {
  //   getLocalIPAddress().then(ipAddress => {
  //     setLocalIP(ipAddress);
  //   });
  // }, []);


  // const searchVideos = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://${localIP}:4000/search?q=${searchQuery}`
  //     );
  //   } catch (error) {
  //     console.error('Error searching videos: ', error);
  //   }
  // }

  // useEffect(() => {
  //   setLoading(true);
  //   fetch(
  //     `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLyOL_RMmwqydRtzTaTuzHc7GCXlAR2aO8&key=${apiKey}&maxResults=1000`,
  //     {}
  //   )
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setPlaylist(data.items);
  //       setLoading(false);
  //     });
  // }, []);



export default Player;



  


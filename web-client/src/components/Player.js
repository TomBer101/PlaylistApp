import React, { useState, useEffect } from 'react';
import axios from 'axios';
import YouTube, {YouTubePlayer} from 'react-youtube';
import getLocalIPAddress from '../utils/getLocalIp';


function Player() {

  const [localIP, setLocalIP] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [videoUrls, setVideoUrls] = useState([]);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  const apiKey = process.env.REACT_APP_KEY;


  useEffect(() => {
    getLocalIPAddress().then(ipAddress => {
      setLocalIP(ipAddress);
    });
  }, []);


  const searchVideos = async () => {
    try {
      const response = await axios.get(
        `http://${localIP}:4000/search?q=${searchQuery}`
      );
    } catch (error) {
      console.error('Error searching videos: ', error);
    }
  }




  return(
    <div className='player-container'>

    </div>
  )
}

export default Player;


// const opts = {
  //   height: "250",
  //   width: "350",
  //   playerVars: {
  //     autoplay: 1,
  //   },
  // };
  
  // <YouTube
  //   videoId={"UEx5T0xfUk1td3F5ZFJ0elRhVHV6SGM3R0NYbEFSMmFPOC5EMEEwRUY5M0RDRTU3NDJC"} //Video id from youtube
  //   opts={opts}
  // />;
  
  // let videoElement = null;

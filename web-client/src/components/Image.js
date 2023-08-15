import React, { useState } from 'react';
import { usePlaylistContext } from '../pages/PlaylistPage';
import ImageGallery from './ImageGallery';
import '../styles/Image.css';

const imagePath = "/images/default.jpg"

function Image() {
    // const { playlistId, baseUrl, editing } = usePlaylistContext();
    const editing = true;
    const [isPopUpVisible, setPopUpVisible] = useState(false);

    const handleImageOnClick = async () => {
        if(editing) {
            setPopUpVisible(true);
        }
    }

    return (
        <div className="image-container">
            <img src={imagePath} alt='cover image' onClick={handleImageOnClick} />
            <ImageGallery setIsVisible={setPopUpVisible} isVisible={isPopUpVisible}/>
        </div>
    )
}

export default Image;
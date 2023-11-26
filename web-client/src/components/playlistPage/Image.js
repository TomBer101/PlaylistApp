import React, { useEffect, useState } from 'react';
import { usePlaylistContext } from '../../pages/PlaylistPage';
import ImageGallery from './ImageGallery';
import '../../styles/playlistPage/Image.css';

const imagePath = "/images/default.jpg"

function Image({imageName}) {
    const { playlistId, baseUrl, editing, ip} = usePlaylistContext();
    const [isPopUpVisible, setPopUpVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(imageName || '');

    console.log('====================================');
    console.log('Rendering Image');
    console.log('====================================');

    useEffect(() => {
        if (selectedImage.startsWith('/uploads-')) {
            const imageSrc = baseUrl.split('/api')[0]+'/uploads/' + selectedImage;
            setSelectedImage(imageSrc);
        }
    }, [selectedImage]);

    useEffect(() => {
        setSelectedImage(imageName || '')
    },[imageName]);

    const handleImageOnClick = async () => {
        if(editing) {
            setPopUpVisible(true);
        }
    }

    return (
        <div className="image-container image" >
            <img src={selectedImage} alt='cover image' onClick={handleImageOnClick} />
            <ImageGallery 
                setIsVisible={setPopUpVisible} 
                selectedImage={selectedImage} 
                isVisible={isPopUpVisible} 
                handleImageSelected={setSelectedImage}
                />
        </div>
    )
}

export default Image;
import React, { useEffect, useState } from 'react';
import { usePlaylistContext } from '../../pages/PlaylistPage';
import ImageGallery from './ImageGallery';
import '../../styles/playlistPage/Image.css';


function Image({imageName, fileName, type}) {

    const { playlistId, baseUrl, editing, ip} = usePlaylistContext();
    const [isPopUpVisible, setPopUpVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

useEffect(() => {
    if (selectedImage.startsWith('/uploads-')) {
        const imageSrc = baseUrl.split('/api')[0]+'/uploads/' + selectedImage;
        setSelectedImage(imageSrc);
    }
}, [selectedImage]);

    useEffect(() => {
        if (type === 'builtin') {
            setSelectedImage(fileName);
        } else if (type === 'uploaded') {
            const base64Image = `data:${imageName.contentType};base64,${imageName.data.toString('base64')}`;
            setSelectedImage(base64Image);
        }
    }, [imageName]);

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
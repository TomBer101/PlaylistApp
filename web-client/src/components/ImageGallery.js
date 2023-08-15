import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import '../styles/ImageGallery.css';

function ImageGallery ({setIsVisible, isVisible}) {

    const images = ['/default.jpg', '/congrats.png', '/good-luck.png', '/happybirthday.jpg'];
    
    function handleUploadImage () {
        console.log('User wants to upload an image');
    }

   return (!isVisible ? null :
        (
            <div className='image-gallery-container'>
                <div className='image-gallery'>
                    <button className='close-button'>
                       <FontAwesomeIcon icon={faCircleXmark} onClick={() => setIsVisible(false)}/>
                    </button>
                    <div className='images-container'>
                        {images.map((image, index) => (
                            <img key={index} className='gallery-image' src={'images'+image} alt={`Image ${index}`} />
                        ))}
                        <button className='upload-button' onClick={handleUploadImage}>
                            <FontAwesomeIcon icon="fa-solid fa-square-plus" />
                        </button>
                    </div>
                </div>
            </div>
        )
    )
}

export default ImageGallery;
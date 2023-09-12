import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { usePlaylistContext } from '../../pages/PlaylistPage';
import '../../styles/playlistPage/ImageGallery.css';

function ImageGallery ({setIsVisible, isVisible, handleImageSelected, selectedImage}) {
    const [images, setImages] = useState(['/images/default.jpg', '/images/congrats.png', '/images/good-luck.png', '/images/happybirthday.jpg']);
    const [uploaded, setUploaded] = useState(null);
    const { playlistId, baseUrl, editing } = usePlaylistContext();
    
    const handleUploadImage = async (event) => {
        const file = event.target.files[0];
        if (file) {
            if (uploaded != null) {
                images.pop();
            }
            setUploaded(file);
            const uploadedImage = URL.createObjectURL(file);
            console.log('uploaded: ', uploadedImage);
            handleImageSelected(uploadedImage);
            console.log(selectedImage);
            setImages((prevImages) => [...prevImages, uploadedImage]);
        }
        //setSekectedImage(uploadedImage)
        // show another thumbnail with the uploaded image
        // set the selected image name 
    }

    const handleImageClick = (imageName) => {
        handleImageSelected(imageName);
    }

    const closeModal = async () => {
        console.log("close modal");
        setIsVisible(false);
        if (selectedImage !== null) {
            if (selectedImage.startsWith('/images')) {
                try {
                    const response = await fetch(baseUrl + `/select-image/${playlistId}`, {
                        method: 'POST',
                        body: JSON.stringify({imageName: selectedImage}),
                        headers:{
                            'Content-Type': 'application/json',
                        },
                    });

                    console.log("The response: ",response);
                    if (!response.ok) {
                        console.error('Failed sending image name to server');
                    }
                } catch (error) {
                    console.error(`Error uploading image name : `+ error );
                    alert('Sending name failed.');
                }

            } else {
                const formData = new FormData();
                formData.append('image', uploaded);
                console.log('Form data: ', formData);
                try {
                    const response = await fetch(baseUrl + `/upload-image/${playlistId}`, {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        console.error('Error uploading image to server');
                    }
                } catch (error) {
                    console.error(`Error uploading image : `+ error );
                    alert(' Uploading image failed.');
                }
            }
        }
    }

   return (!isVisible ? null :
        (
            <div className='image-gallery-container'>
                <div className='image-gallery-modal'>
                    <button className='close-button' onClick={closeModal}>
                       <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                    <div className='images-container' style={{marginTop:'27px'}}>
                        {images.map((image, index) => (
                            <div key={index} className={`thumbnail ${selectedImage === image? 'selected' : ''}`}
                             onClick={() => handleImageClick(image)} >
                                <img key={index}  src={image} alt={`Image ${index}`} />
                            </div>
                        ))}
                        <label className='upload-button' htmlFor='image-input'> {/* TODO: fix the upload button*/}
                            <FontAwesomeIcon icon={faSquarePlus} />
                            <input 
                                type='file'
                                name='image'
                                id='image-input'
                                style={{display: 'none'}}
                                accept='image/*'
                                onChange={handleUploadImage}
                            />
                        </label>
                    </div>
                </div>
            </div>
        )
    )
}

export default ImageGallery;
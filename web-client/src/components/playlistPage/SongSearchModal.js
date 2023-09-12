import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import ListItem from '../../components/playlistPage/ListItem';
import '../../styles/playlistPage/SongSearchModal.css';

function SongSearchModal ({setIsVisible, isVisible, songIndex, handleSongChosing}) {
    const apiKey = process.env.REACT_APP_KEY;
    const [inputText, setInputText] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    

    useEffect(() => {
        setInputText('');
    }, []);

    function handleChange(event) {
        const newVal = event.target.value;
        setInputText(newVal);
    }  

    async function searchSong (songName) {
        console.log('song name: ',songName);
        if (songName != ""){
            try {
            const response =  await fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&type=video&part=snippet&q=${songName}&maxResults=20` );
            const data = await response.json();
            const songs = data.items;
            setSearchResult(songs);
            //setShowResults(true);
            console.log("songs data: ",songs);
            console.log("result data: ",data);
            } catch (error) {
                console.error('Error fetching songs data: ', error);
            }
        }
        
    }

    const closeModal = async () => { //TODO: make sure list is getting empty.
        setIsVisible(false);
        //setShowResults(false);
        setSearchResult([]);
        setInputText('');
        if (inputText !== '') {
            console.log('In songBox - need to send search request to youTube data api');
        }
    }

    const handleItemClick = (youtubeId) => {
        console.log('Clicked on item: ', youtubeId);
        handleSongChosing(youtubeId);
        setIsVisible(false);
    }


    return (!isVisible ? null :
        <div className='modal-container'>
            <div className='modal'>
                <button className='close-button'>
                    <FontAwesomeIcon icon={faCircleXmark} onClick={closeModal} />
                </button>
                <div className='input-container'>
                    <input type='text' value={inputText} onChange={handleChange}/>
                    <i className="fa-solid fa-magnifying-glass" onClick={() => searchSong(inputText)}/>
                </div>
                {searchResult.length != 0 && 
                <div className='list-container' >
                    <ul>
                        {searchResult.map((result) => (
                            <ListItem 
                            key={result.id.videoId} 
                            youtubeId={result.id.videoId} 
                            title={result.snippet.title} 
                            handleClick={()=>handleItemClick(result.id.videoId)}
                            />
                        ))}
                    </ul>
                </div>}

            </div>
        </div>

    )

}

export default SongSearchModal;
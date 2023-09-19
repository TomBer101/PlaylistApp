import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faCirclePause, faTrashCan} from '@fortawesome/free-regular-svg-icons';
import { usePlaylistContext } from '../../pages/PlaylistPage';
import '../../styles/playlistPage/SongBox.css';


function SongBox({songId, inSearch, songIndex, handleClick, isPlaying, onClickPlay, handleDelete}) {

    const [songTitle, setSongTitle] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [action, setAction] = useState();
    const [isTitleExpanded, setTitleExpanded] = useState(false);
    const [isTitleScrolling, setTitleScrolling] = useState(false);
    const { playlistId, baseUrl, editing} = usePlaylistContext(); 
    const [showGarbageIcon, setShowGarbageIcon] = useState(false);
    const [longPressInProgress, setLongPressInProgress] = useState(false);

    const key = process.env.REACT_APP_KEY;
    const titleThreshold = 25;

    const titleParentRef = useRef(null);
    const titleRef = useRef(null);
    const timerRef = useRef();
    const isLongPress = useRef();
    const songBoxRef = useRef(null);


    let longPressTimer;

    useEffect(() => {
        if (songId != null) {
             const titleElement = titleRef.current;
            const titleParentContainer = titleParentRef.current;
        
            const isTooLong = titleElement.scrollWidth > titleParentContainer.offsetWidth;
        
            if (isTooLong) {
            titleElement.classList.add('expanded');
            } else {
            titleElement.classList.remove('expanded');
            }
        }

      }, [songTitle]);


    useEffect(() => {
        fetchSongData(songId) //commented to prevent using youtube api when develpoing
    }, [songId])

    useEffect(() => {
        const handleDocumentClick = (event) => {
          if (  songBoxRef.current && 
                !songBoxRef.current.contains(event.target) && 
                showGarbageIcon) {
            setShowGarbageIcon(false);
          }
        };
    
        // Add a click event listener to the document body
        document.body.addEventListener('click', handleDocumentClick);
    
        // Clean up the event listener when the component unmounts
        return () => {
          document.body.removeEventListener('click', handleDocumentClick);
        };
      }, [showGarbageIcon]);

    async function fetchSongData(songId) {
        if (songId != null){
            try {
            const response =  await fetch(`https://www.googleapis.com/youtube/v3/search?key=${key}&type=video&part=snippet&q=${songId}` );
            const data = await response.json();
            console.log("song data: ",data);
            const song = data.items[0];
            setImgUrl(song.snippet.thumbnails.default.url);
            setSongTitle((song.snippet.title).split('(')[0]);
            } catch (error) {
                console.error('Error fetching songs data: ', error);
            }
        }
    }


    function handleOnClick() {
        if (editing) {
            handleClick();
            if ( isLongPress.current ) {
                console.log('Is long press - not continuing.');
                return;
              }
              setAction('click')
        }
    }

    const handleMouseDown = () => {
        if(editing) {
            longPressTimer = setTimeout(() => {
                setShowGarbageIcon(true);
                setLongPressInProgress(true);
            }, 3000);
        }
    };

    const handleMouseUp = () => {
        if (editing) {
            clearTimeout(longPressTimer);
            if (longPressInProgress) {
              // Long press was detected, don't hide the garbage icon
              setLongPressInProgress(false);
            } else {
              // No long press, hide the garbage icon
              setShowGarbageIcon(false);
            }
        }
    };

    const handleGarbageIconClick = () => {
        // Handle the removal of the song from the playlist
        console.log('Want to delete song: ', songId);
    };

    // function handleOnClick(e) {
    //     console.log('handleOnClick');
    //     if ( isLongPress.current ) {
    //       console.log('Is long press - not continuing.');
    //       return;
    //     }
    //     setAction('click')
    //   }

    const handleOnMouseUp = () => {
        console.log('handleOnMouseUp');
        if(editing) {clearTimeout(timerRef.current); }
    }

     const handleOnMouseDown = () => {
        console.log('handleOnMouseDown');
        if (editing) {startPressTimer();}
     }

    const handleOnTouchStart = () => {
        console.log('handleOnTouchStart');
        if (editing) {startPressTimer();}
    }

    const handleOnTouchEnd = () => {
        console.log('handleOnTouchEnd');
        if (editing) {clearTimeout(timerRef.current);}
     }

    function startPressTimer() {
        isLongPress.current = false;
        timerRef.current = setTimeout(() => {
        isLongPress.current = true;
        setAction('longpress');
        setShowGarbageIcon(true);
        }, 1000);
    }
    

    if (songId == null) {
        if (editing) {
            return (
            <div className='empty-song-box'  onClick={handleOnClick}>
                <div className='song-details'>
                    <div className='song-title empty-title-underline'>Add Song</div>
                </div>
          </div>
        ); 
        } else return '';

    }

    const imagePath = "/images/good-luck.png";

    return (
        
        <div className="song-box-container" ref={songBoxRef}>
            <div 
            className={`song-box ${showGarbageIcon? 'with-garbage' : ''}`} 
            onMouseDown={handleOnMouseDown}
            onMouseUp={handleOnMouseUp}
            onTouchStart={handleOnTouchStart}
            onTouchEnd={handleOnTouchEnd}
        >
                <div className='image-thumbnail'>
                    <img src={imgUrl} alt='song thumbnail'/>
                </div>
                <div ref={titleParentRef} className={`song-details ${isTitleScrolling?'scrolling':''}`}  onClick={handleOnClick}>
                    <div ref={titleRef} className={`song-title ${isTitleExpanded ? 'expanded' : ''}`} onClick={handleClick}>
                        {songTitle}
                    </div>
                </div>
                {inSearch? null : (
                    <button className='play-button' disabled={inSearch} hidden={inSearch} onClick={onClickPlay}>
                    <FontAwesomeIcon icon={isPlaying?faCirclePause:faCirclePlay} />
                </button>)}
            </div>
            {showGarbageIcon && (
                <div className='garbage-icon' onClick={() => {handleDelete(songId); setShowGarbageIcon(false)}}>
                    <FontAwesomeIcon icon={faTrashCan} />
                </div>
            )}
        </div>
        

    )

}


export default SongBox;
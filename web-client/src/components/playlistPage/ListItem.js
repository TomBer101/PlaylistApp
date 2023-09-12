import React, { useEffect, useRef, useState } from 'react';
import '../../styles/playlistPage/ListItem.css';

function ListItem({title, youtubeId, handleClick}) {

    const titleParentRef = useRef(null);
    const titleRef = useRef(null);

    useEffect(() => {
        const titleElement = titleRef.current;
        const titleParentContainer = titleParentRef.current;

        const isTooLong = titleElement.scrollWidth > titleParentContainer.offsetWidth;
        if (isTooLong) {
            titleElement.classList.add('expanded');
        } else {
            titleElement.classList.remove('expanded');
        }
    }, [title]);


    return (
        <li ref={titleParentRef} className='song-details' onClick={handleClick}>
            <div ref={titleRef} className='song-title'>
                {title}
            </div>
        </li>
    )


}

export default ListItem;
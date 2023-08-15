import React, { useState } from 'react';
import { usePlaylistContext } from '../pages/PlaylistPage';
import '../styles/Title.css';

function Title() {
    // const { playlistId, baseUrl, editing } = usePlaylistContext();
    const [inputText, setInputText] = useState('');
    const [editing, isEditing] = useState(true);

    function handleChange(event) {
        const newVal = event.target.value;
        setInputText(newVal);
    }

    async function saveName () {
        console.log("Sendong request to save the name: ", inputText);
        // try{
        //     const response = await fetch(baseUrl + `/change-name/${playlistId}`, {
        //         method:'POST',
        //         body: JSON.stringify({name: inputText}),
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });

        //     const result = await response.json();
        //     console.log(result);
        // } catch (error) {
        //     console.error("There was an error changing the name: ", error);
        // }
    }


    return (
        <div className="title">
            <input type='text' value={inputText} onChange={handleChange} disabled={!editing} onBlur={saveName} placeholder='Name the playlist'/>
        </div>
    )
}

export default Title;
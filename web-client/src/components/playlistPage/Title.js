import React, { useEffect, useState } from 'react';
import { usePlaylistContext } from '../../pages/PlaylistPage';
import '../../styles/playlistPage/Title.css';

function Title({name}) {
    const { playlistId, baseUrl, editing } = usePlaylistContext(); 
    const [inputText, setInputText] = useState(name || '');

    useEffect(() => {
        setInputText(name || '');
    }, [name]);

    function handleChange(event) {
        const newVal = event.target.value;
        setInputText(newVal);
    }

    async function saveName () {
        console.log('jsonf: ', JSON.stringify({name: inputText}));
        try{
            console.log(baseUrl);
            const response = await fetch(baseUrl + `/change-name/${playlistId}`, {
                method:'POST',
                body: JSON.stringify({name: inputText}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error("There was an error changing the name: ", error);
        }
    }


    return (
        <div className="title">
            <input 
                type='text' 
                value={inputText} 
                onChange={handleChange} 
                disabled={!editing} 
                onBlur={saveName} 
                placeholder='Name the playlist'
            />
        </div>
    )
}

export default Title;
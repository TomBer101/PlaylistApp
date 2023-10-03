import React, { useState, useEffect } from "react";
import { useAdminContext } from "../../pages/AdminPage";
import '../../styles/adminPage/PlaylistsList.css';
import PlaylistBlock from "../adminPage/PlaylistBlock";

function PlaylistsList({setSelectedPlaylist, fetchDataIndicator}) {
    const {baseUrl} = useAdminContext();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetchAllPlaylists();
    }, [playlists]);

    // useEffect(() => {
    //     fetchAllPlaylists();
    // }, [fetchDataIndicator]);
    
    useEffect(() => {
        const eventSource = new EventSource(process.env.REACT_APP_SERVER + '/api/sse/playlistsupdates');
        eventSource.addEventListener('message', event => {
            const data = JSON.parse(event.data);
            console.log('data recieved fro sse: ', data);
            if (data.type === 'update') {
                setPlaylists(current => [...current, data.playlistData]);
            }
        })
    }, [])

    const fetchAllPlaylists = () => {
        fetch(`${baseUrl}/showplaylists`)
        .then(response => response.json())
        .then(data => {
            setPlaylists(data);
            setLoading(false);
            console.log("the playlists: ", data);
        })
        .catch(error => {
            console.log('Error fetching all playlists: ', error);
            setLoading(false);
        });
    }

    console.log("The list state is: ", playlists);
    return (
        <div className="list-container">
            <h2>Playlists</h2>
            <ul className="list">
                {loading ?<p>Loading...</p>: (playlists.map((playlist, index) => (
                    <PlaylistBlock 
                    key={index} 
                    playlistInfo={playlist} 
                    setSelectedPlaylist={setSelectedPlaylist}
                    />
                )))}
            </ul>
        </div>
    );
}


export default PlaylistsList;
import React, { useState, useEffect } from "react";
import { useAdminContext } from "../../pages/AdminPage";
import '../../styles/adminPage/PlaylistsList.css';
import PlaylistBlock from "../adminPage/PlaylistBlock";

function PlaylistsList({ setCreatedQR, setSelectedPlaylist }) {
    const { baseUrl, selectedPlaylist, createdQR } = useAdminContext();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eventSource, setEventSource] = useState(null);


    useEffect(() => {
        fetchAllPlaylists();
    }, []);


    useEffect(() => {
        const newEventSource = new EventSource(process.env.REACT_APP_SERVER + '/api/sse/playlistsupdates');

        newEventSource.addEventListener('message', event => {

            const data = JSON.parse(event.data);
            if (data.type === 'update') {
                setPlaylists(current => [...current, data.playlistData]);
                console.log('created qr: ', createdQR);
                if (createdQR && data.playlistData._id === createdQR.id) {
                    console.log('New playlist: ', data.playlistData._id, 'My playlist: ', createdQR.id);
                    setCreatedQR(null);
                }
            }
        });

        return () => {
            newEventSource.close();
        };
    }, [createdQR])

    const fetchAllPlaylists = () => {
        fetch(`${baseUrl}/showplaylists`)
            .then(response => response.json())
            .then(data => {
                setPlaylists(data);
                setLoading(false);
            })
            .catch(error => {
                console.log('Error fetching all playlists: ', error);
                setLoading(false);
            });
    }

    return (
        <div className="list-container">
            <h2>Playlists</h2>
            <ul className="list">
                {loading ? <p>Loading...</p> : (playlists.map((playlist, index) => (
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
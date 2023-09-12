import React, { useState, useEffect } from "react";
import { useAdminContext } from "../../pages/AdminPage";
import '../../styles/adminPage/PlaylistsList.css';
import PlaylistBlock from "../adminPage/PlaylistBlock";

function PlaylistsList({setSelectedPlaylist}) {
    const {baseUrl} = useAdminContext();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    // const dummyData = [
    //     {
    //         coverImage: '/images/background.jpg',
    //         name:'my first playlist',
    //     },
    //     {
    //         coverImage: '/images/background.jpg',
    //         name:'my second playlist',
    //     },
    //     {
    //         coverImage: '/images/background.jpg',
    //         name:'my third playlist',
    //     },
    //     // {
    //     //     coverImage: '/images/background.jpg',
    //     //     name:'my fourth playlist',
    //     // },
    //     // {
    //     //     coverImage: '/images/background.jpg',
    //     //     name:'my fifth playlist',
    //     // },
    //     // {
    //     //     coverImage: '/images/background.jpg',
    //     //     name:'my harta playlist',
    //     // },
    //     // {
    //     //     coverImage: '/images/background.jpg',
    //     //     name:'my barta playlist',
    //     // },
    // ]

    useEffect(() => {
        fetchAllPlaylists();
    }, []);

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
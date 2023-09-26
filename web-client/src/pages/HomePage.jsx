// import React from "react";
// import LocalAuth from "../components/auth/LocalAuth";
// import '../styles/homePage/HomePage.css';


// function HomePage() {


//     return <h1>Home Page</h1>
//     // home page should contain signing page within and then there would be only one redirection

//     // return (
//     //     <div className="container">
//     //         <h1>Sound Card</h1>
//     //         <div className="row">
//     //             <div className="col">
//     //                 <div className="card signin-login">
//     //                     <LocalAuth />
//     //                 </div>
//     //             </div>

                
//     //             <div className="card autho">

//     //             </div>
//     //         </div>
//     //     </div>
//     // )
// }

// export default HomePage;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      }

      const response = await fetch("http://localhost:3030/", {
        method: 'POST', 
        headers:{
            'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

      const { status, admin, playlistId } = await response.json();
      if (!status) {
        return (removeCookie("token"), navigate("/login"));
      }
        
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);


  const Logout = () => {
    removeCookie("token");
    navigate("/signup");
  };

  return (
    <>
      <div className="home_page">
        <h4>
        </h4>
        <button onClick={Logout}>LOGOUT</button>
      </div>
    </>
  );
};

export default Home;
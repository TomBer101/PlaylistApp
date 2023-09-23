import React from "react";
import LocalAuth from "../components/auth/LocalAuth";
import '../styles/homePage/HomePage.css';


function HomePage() {


    // home page should contain signing page within and then there would be only one redirection

    return (
        <div className="container">
            <h1>Sound Card</h1>
            <div className="row">
                <div className="col">
                    <div className="card signin-login">
                        <LocalAuth />
                    </div>
                </div>

                
                <div className="card autho">

                </div>
            </div>
        </div>
    )
}

export default HomePage;
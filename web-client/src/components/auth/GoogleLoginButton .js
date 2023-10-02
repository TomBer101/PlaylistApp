import React from 'react';

const GoogleLoginButton = () => {

  // const handleGoogleLogin = async () => {
  //   try {
  //     // Send a POST request to your server to initiate the OAuth flow

  //     const response = await fetch(process.env.REACT_APP_SERVER + '/google', {
  //       method: "POST",
  //       headers: {
  //           'Content-Type': 'application/json',
  //           'Access-Control-Allow-Origin': 'http://localhost:3000',
  //           'Access-Control-Allow-Headers' : 'access-control-allow-origin,content-type'
  //         }, 
  //     });
  //     console.log('response from google auth: ' + response.data);

  //     if (!response.ok) {

  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  function navigate(url) {
    window.location.href = url;
  };

  async function auth(){
    const response = await fetch('http://localhost:3030/google', {
      method: 'POST'
    });

    if (!response.ok) {
      console.error('Error login with google');
      navigate('/');
    }
    
    const data = await response.json();
    navigate(data);
  }

  return (
    <a className="btn btn-primary" style={{backgroundColor:'#dd4b39' }} href={process.env.REACT_APP_SERVER + '/adminAuth/google'}>
        <i className="fab fa-google" style={{marginRight:'0.5rem'}}></i>
            Sign In with Google
    </a>  
  );
};

export default GoogleLoginButton;

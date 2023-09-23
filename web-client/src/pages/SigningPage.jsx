import React from 'react';


function SigningPage({ action }) { //action will be either register or sign in



    return(
        <div>
            <h1>{action}</h1><br/>
            <p>left side will be a form and will create jwt</p><br/>
            <p>right side will be a social aythentication</p><br/>
            <p>all of the requests will be determine by 'action'</p>
        </div>
    )
}



// function AdminLogin() {
//     const handleLoginClick = () => {
//       // Redirect the user to Google's OAuth consent screen
//       window.location.href = `https://accounts.google.com/o/oauth2/auth' +
//         '?response_type=code' +
//         '&client_id=${process.env.REACT_APP_CLIENT_ID}' +
//         '&scope=openid%20email%20profile`; // Define required scopes
  
//       // Make sure to replace YOUR_CLIENT_ID and YOUR_REDIRECT_URI
//     };
  
//     return (
//       <div>
//         <h2>Login as Admin</h2>
//         <button onClick={handleLoginClick}>Login with Google</button>
//       </div>
//     );
//   }
  
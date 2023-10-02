import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/auth/LocalAuth.css';
import GoogleLoginButton from "../components/auth/GoogleLoginButton ";

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };


const handleSubmit = async (e) => {
    e.preventDefault();
    try {

        const requestBody = JSON.stringify({...inputValue});
        const response = await fetch(process.env.REACT_APP_SERVER + "/login", {
            method: "POST", 
            headers: {
                'Content-Type': 'application/json',
              },
            body: requestBody,
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}, message: ${response.message}`);
        }

        // console.log('The response: ', await response.json());
        const data = await response.json();
        console.log('Message from login: ',data);
            navigate('/');

     
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
    });
  };

  return (
    <div className="form_container">
      <h2>Login Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <div className="line"/>
      <div className="card" style={{marginBottom:'1rem'}}>
        <GoogleLoginButton />
      </div>
      <span >
        New Here? Click <Link to={"/signup"}>Signup</Link>
      </span>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/auth/LocalAuth.css';

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
        const response = await fetch("http://localhost:3030/log-in", {
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
        const {success, message} = await response.json();
        console.log('Message from login: ',message);
        if (success) {
            navigate('/');
        } 

     
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
        <span>
          Already have an account? <Link to={"/signup"}>Signup</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;

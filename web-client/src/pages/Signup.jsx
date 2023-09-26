import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/auth/LocalAuth.css';

const Signup = () => {
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
        const response = await fetch("http://localhost:3030/sign-up", {
            method: "POST", 
            headers: {
                'Content-Type': 'application/json',
              },
            body: requestBody,
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const {success, message} = await response.json();
        console.log('message' + message);
        if (success) {
            console.log('In success.');
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
      <h2>Signup Account</h2>
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
          Already have an account? <Link to={"/login"}>Login</Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
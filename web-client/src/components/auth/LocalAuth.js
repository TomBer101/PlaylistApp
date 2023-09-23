import React, { useState } from 'react';
import '../../styles/auth/LocalAuth.css';

function LocalAuth () {

const [input, setInput] = useState({
    email: '',
    password: '',
});

function handleChange(event) {
    const { name, value } = event.target;
    setInput(prevInput => {
        return {
            ...prevInput,
            [name] : value
        }
    });
}

function handleOnClick (action) {
    console.log(`button ${action} was clicked.`);
}


return (
    <div className='local-auth'>
        <h2>Please sign in or sign up</h2>
        <form className='user-input'>
            <div className='form-group'>
                <label htmlFor='email'>Email:</label>
                <input type='email' name='email' value={input.email} onChange={handleChange} className='form-control'/>
            </div>
            <div className='form-group'>
                <label htmlFor='password'>Password:</label>
                <input type='password' name='password' value={input.password} onChange={handleChange} className='form-control'/>
            </div>
        </form>
        <div className='buttons-container'>
            <button className='sign-up-button' onClick={()=>handleOnClick('sign-up')}>Sign Up</button>
            <button className='sign-in-button' onClick={()=>handleOnClick('sign-in')}>Sign In</button>
        </div>

    </div>
)

}

export default LocalAuth;
import React, { useState } from 'react'
import './login.css';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';

function SignupPage() {
 
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleusernameChange = (e) => {
      setUsername(e.target.value);
    };
  
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      // Perform your signup logic here
      console.log('Username:', username);
      console.log('Email:', email);
      console.log('Password:', password);

      axios.post(`http://192.168.1.34:8000/api/emp/v1/signup`,
      {
        username,
        email,
        password
      })
      .then(res => {
        console.log(res)
        if(res.status == 200){
            let empData = res.data.emp;
            let messege = res.data.messege;
            if(window.confirm(messege)){
                window.location.href = '/login';
            }
        }else{
            alert("Invalid request")
        }

      })
      .catch(error => {   
            alert(error.response.data.error);
      })
  
      // Reset the form
      setUsername('');
      setEmail('');
      setPassword('');
    };
  
    return (
      <div className='sign-up'>
        <div className="auth-form-container">
        <h2 className="form-title">Sign Up</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Full Name:</label>
            <input
              type="text"
              id="username" 
              name="username"
              value={username}
              onChange={handleusernameChange}
              className="form-input"
              required
            />
          </div>
  
          {/* Similar form structure as the login form */}
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              className="form-input"
              required
            />
          </div>
  
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              className="form-input"
              required
            />
          </div>
  
          <button type="submit" className="submit-button">Sign Up</button>
        </form>
        <br />
        <p>Don't have an account <Link className='signup-link' to={'/login'}>Login here</Link></p>
      </div>
      </div>
    );
}

export default SignupPage

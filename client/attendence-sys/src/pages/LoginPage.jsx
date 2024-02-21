import React, { useContext, useState } from 'react';
import axios from 'axios';
import './login.css'; // Import your CSS file for styling
import { Link, useNavigate } from 'react-router-dom';
import { authContext } from '../App';
//client\attendence-sys\src\pages\login.css
function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {isAuthenticated, setIsAuthenticated} = useContext(authContext)
    const navigate = useNavigate();
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      axios.post(`https://attendence-system-psi.vercel.app/api/emp/v1/login`,
      {
        email,
        password
      })
      .then(res => {
        if(res.status == 200){
            console.log(res);
            const token = res.data.token;
            localStorage.setItem("my_token", token);
            let username = res.data.username;
            localStorage.setItem("my_username", username);
            let messege = res.data.messege;
            alert(messege);
            navigate('/')
            
        }else{
            alert("Invalid Request");
        }

      })//
      .catch(error => {
        alert("try again");
      })
      // Reset the form
      setEmail('');
      setPassword('');
    };
  
    return (
      <div className='login-cont'>
        <div className="login-form-container">
        <h2 className="form-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
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
  
          <button type="submit" className="submit-button">Login</button>
        </form>
        <br />  
        
        <p>Don't have an account <Link className='signup-link' to={'/signup'}>SignUp here</Link></p>
      </div>
      </div>
    );
}
export default LoginPage

import React, { useContext, useEffect } from 'react'
import { authContext } from '../App'
import { Navigate } from 'react-router-dom';
import './global.css';
import logo from '../assets/images/logo.svg'
import CheckinButton from '../components/CheckinButton';
import CheckoutButton from '../components/CheckoutButton';
import StartBreakButton from '../components/StartBreakButton';
import EndBreakButton from '../components/EndBreakButton';

function Dashboard() {

  const {isAuthenticated, setIsAuthenticated, username, setUserName, ischeckedIn,
    setIsCheckedIn, isOnBreak, setIsOnBreak, isCheckedOut, setIsCheckedOut} = useContext(authContext);

  useEffect(()=>{
    setUserName(localStorage.getItem("my_username"));
    const t = localStorage.getItem("my_token");
    if(!t){
      console.log("false  ")
    }
  },[isAuthenticated])

  return (
    <div className="dashboard">
      <Header name={username} />
      <div className="main-btns">
        <CheckinButton name={username} />
        <StartBreakButton name={username} />
        <EndBreakButton name={username} />
        <CheckoutButton name={username} />
      </div>
    </div>
  );
}
//client\attendence-sys\src\assets\images\Group 365@3x.png
function Header({name}){
  let capsName = name.toUpperCase();
  return(
    <div className='header'>
      
      <div className='header-right'><img src={logo} alt="nits_logo"/></div>
      <h1>Welcome, {capsName}</h1>
    </div>
  )
}
export default Dashboard

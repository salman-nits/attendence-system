import React, { useContext, useEffect, useState } from 'react'
import { authContext } from '../App'
import { Navigate, useNavigate } from 'react-router-dom';
import './global.css';
import logo from '../assets/images/logo.svg'
import CheckinButton from '../components/CheckinButton';
import CheckoutButton from '../components/CheckoutButton';
import StartBreakButton from '../components/StartBreakButton';
import EndBreakButton from '../components/EndBreakButton';
import  axios  from 'axios';

function Dashboard() {

  const {isAuthenticated, setIsAuthenticated, username, setUserName, ischeckedIn,
    setIsCheckedIn, isOnBreak, setIsOnBreak, isCheckedOut, setIsCheckedOut} = useContext(authContext);
  const navigate = useNavigate()
  const [attendance, setAttendance] = useState([]);
  useEffect(()=>{
    setUserName(localStorage.getItem("my_username"));
    const t = localStorage.getItem("my_token");
    if(!t){
      
      setIsAuthenticated(false);
      navigate('/login');
    }
    axios.get(`https://attendence-system-psi.vercel.app/api/emp/v1/me`,{
      headers: {
        'Authorization': `Bearer ${t}`, // Include the auth token in the headers
        'Content-Type': 'application/json',
      },
    })
    .then(res => {
      setAttendance(res.data.attendance)
      
    })
    .catch(err=> {
      if(err.response && err.response.status === 401){
        localStorage.removeItem("my_token");
        navigate('/login');
      }
      console.log(err)
    });
// response.status

  },[isAuthenticated])

  return (
    <div className="dashboard">
      <Header name={username} />
      <Greetings></Greetings>
      <div className="main-btns">
        <CheckinButton name={username} />
        <StartBreakButton name={username} />
        <EndBreakButton name={username} />
        <CheckoutButton name={username} />
      </div>
      <AttendanceTable attendanceData={attendance}></AttendanceTable>
    
    </div>
  );
}
//data.attendance
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
function Greetings(){
  const greetingQuotes = [
    
    "Hello there! 🌟 Ready to conquer the day together? 💪",
    "Welcome back! 🌼 Your positive vibes make the office brighter! 😊",
    "Greetings! 🚀 Let's make today amazing and productive! 🌟",
    "Hey! 🌞 Wishing you a day full of achievements and smiles! 😃",
    "Good to see you! 🌈 Your presence adds so much to our workplace! 👏",
    "Hi there! 🌟 Embrace the challenges, and let's rock this day! 🚀",
    "Hello! 🌺 Your hard work makes a difference – keep it up! 💼",
    "Top of the morning to you! ☕️ Ready for a day of success? 💪",
    "Welcome! 🌈 Your dedication inspires us all. Let's do great things! 👍",
    "Good vibes only! 🌈 Let's make today as awesome as you are! 😎",
  "Hello, superstar! 🌟 Your positive energy fuels our success! 💼",
  "Welcome back! 🌞 Shine bright today – you've got this! ✨",
  "Greetings, champion! 🏆 Embrace challenges, conquer goals! 💪",
  "Hey there! 🚀 Your dedication is the key to our collective success! 👏",
  "Hi, rockstar! 🌟 Today is another chance to make a difference! 🌈",
  "Good to see you again! 😊 Your presence elevates the team spirit! 👥",
  "Hola! 🌺 Every small effort counts, and you're making a big impact! 👍",
  "Morning, motivator! ☕️ Your enthusiasm lights up the workplace! 🔥",
  "Welcome! 🌼 Success is a journey, not a destination. Enjoy every step! 🚀",
  ];
  let randomGreeting = greetingQuotes[Math.floor(Math.random() * greetingQuotes.length)];

  return (
    <div className='greeting'>
    <h2 >{randomGreeting}</h2>
    </div>
  )
}
const AttendanceTable = ({ attendanceData }) => {
  const convertToIST = (utcTime) => {
    const utcDate = new Date(utcTime);
    // const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5.5
    // const istDate = new Date(utcDate.getTime() + istOffset);
    return utcDate.toLocaleString();
  };
  return (
    <div className="attendance-table-container">
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Check-In Time (IST)</th>
            <th>Check-Out Time (IST)</th>
            <th>Total Worked Hours</th>
            <th>Break Times</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((entry) => (
            <tr key={entry._id}>
              <td>{entry.date}</td>
              <td>{convertToIST(entry.checkInTime)}</td>
              <td>{convertToIST(entry.checkOutTime)}</td>
              <td>{entry.totalWorkedHours< 0 ? "After Chekout" : entry.totalWorkedHours.toFixed(2) + " hours"} </td>
              <td>
                {entry.breakTimes.length > 0 ? (
                  entry.breakTimes.map((breakTime) => (
                    <div key={breakTime._id}>
                      {`${convertToIST(breakTime.start)} - ${convertToIST(breakTime.end)}`}
                    </div>
                  ))
                ) : (
                  <span>No breaks</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Dashboard

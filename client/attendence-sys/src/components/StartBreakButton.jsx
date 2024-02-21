import React, { useContext } from 'react'
import { authContext} from '../App';
import axios from 'axios';
import './btns.css'

function StartBreakButton({name}) {
  const {isAuthenticated, setIsAuthenticated, ischeckedIn,
    setIsCheckedIn, isOnBreak, setIsOnBreak, isCheckedOut, setIsCheckedOut} = useContext(authContext);

  const handkeStartBreak = async()=>{
    if(!localStorage.getItem("todays_date")){
      alert(`${name},  you can not start break before check in or after checkout`);
    }
    if(localStorage.getItem("break_start_time")){
      alert(`${name}, You are already on break`)
    }
    else{
      try {
        const breakStartTime = new Date();
        // const year = nowDate.getFullYear();
        // const month = nowDate.getMonth() + 1; // Months are zero-indexed in JavaScript
        // const day = nowDate.getDate();
  
        // const todayDate = `${year}-${month}-${day}`;
  
        const currentTime = new Date().toISOString(); // Get the current time in ISO format
        const authToken = localStorage.getItem("my_token");
        
        if(!authToken){
          setIsAuthenticated(false);
        }
       

        const response = await axios.post(`http://192.168.1.34:8000/api/emp/v1/startbreak`, {
          checkInTime: currentTime,
          date : localStorage.getItem("todays_date")
        }, {
          headers: {
            'Authorization': `Bearer ${authToken}`, // Include the auth token in the headers
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 200) {
          localStorage.setItem("break_start_time", breakStartTime);
          console.log('break start:', response.data);

        } else {
             }
  
      } catch (error) {
        console.error('Error during starting break:', error);
        // Handle error, display a message to the user, etc.
      }
      setIsOnBreak(true);
    }
  }
  return (
    <div>
      <button className='btn btn-hover' onClick={handkeStartBreak}>Break Start</button>
    </div>
  )
}

export default StartBreakButton

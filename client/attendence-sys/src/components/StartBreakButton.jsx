import React, { useContext } from 'react'
import { authContext} from '../App';
import axios from 'axios';
import './btns.css'

function StartBreakButton({name}) {
  const {isAuthenticated, setIsAuthenticated, ischeckedIn,
    setIsCheckedIn, isOnBreak, setIsOnBreak, isCheckedOut, setIsCheckedOut} = useContext(authContext);

  const handkeStartBreak = async()=>{
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = nowDate.getMonth() + 1; // Months are zero-indexed in JavaScript
    const day = nowDate.getDate();

    const todayDate = `${day}-${month}-${year}`;
    
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
       

        const response = await axios.post(`https://attendence-system-psi.vercel.app/api/emp/v1/startbreak`, {
          checkInTime: currentTime,
          date : todayDate
        }, {
          headers: {
            'Authorization': `Bearer ${authToken}`, // Include the auth token in the headers
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 200) {
          alert("Started Break");
        }
  
      } catch (error) {
        console.error('Error during starting break:', error);
        if(error.response.status === 400){
          const errorMessege = error.response.data.message;
          alert(errorMessege);
        }
        // Handle error, display a message to the user, etc.
      }
    
  }
  return (
    <div>
      <button className='btn btn-hover' onClick={handkeStartBreak}>Break Start</button>
    </div>
  )
}

export default StartBreakButton

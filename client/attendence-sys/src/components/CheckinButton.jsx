import React, { useContext } from 'react';
import { authContext} from '../App';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

function CheckinButton({name}) {
  const {isAuthenticated, setIsAuthenticated, ischeckedIn,
    setIsCheckedIn, isOnBreak, setIsOnBreak, isCheckedOut, setIsCheckedOut} = useContext(authContext);
  const handleCheckin = async () => {
    
    if(localStorage.getItem("todays_date")){
      alert(`${name}, You are already Checked in`)
    }
    else{
      try {
        const nowDate = new Date();
        const year = nowDate.getFullYear();
        const month = nowDate.getMonth() + 1; // Months are zero-indexed in JavaScript
        const day = nowDate.getDate();
  
        const todayDate = `${day}-${month}-${year}`;
  
        const currentTime = new Date().toISOString(); // Get the current time in ISO format
        const authToken = localStorage.getItem("my_token");
        
        if(!authToken){
          setIsAuthenticated(false);
        }

        const response = await axios.post(`http://192.168.1.34:8000/api/emp/v1/checkin`, {
          checkInTime: currentTime,
          date : todayDate
        }, {
          headers: {
            'Authorization': `Bearer ${authToken}`, // Include the auth token in the headers
            'Content-Type': 'application/json',
          },
        });
  
       if(response){
        if (response.status === 200) {
          localStorage.setItem("todays_date", todayDate);
          console.log('Check in successful:', response.data);
        } else {
         console.log("this is from else condition",response)  
        }
       }
      } catch (error) {
        console.log('Error during check-in:', error);
        if(error){
          if(error.response.status === 403){
            setIsAuthenticated(false);
            localStorage.removeItem("my_token")
          }if(error.response.status === 400){
            const er = error.response.data.message;
            console.log(er)
            alert(er)
          }
        }
      }
      
      setIsCheckedIn(true);
      setIsOnBreak(false);
      setIsCheckedOut(false);
    }
  };
  return (
    <div>
      <button className='btn btn-hover' onClick={handleCheckin}>Check In</button>
    </div>
  )
}

export default CheckinButton

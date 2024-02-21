import React,{useContext} from 'react'
import { authContext} from '../App';
import axios from 'axios';


function EndBreakButton({name}) {
  const {isAuthenticated, setIsAuthenticated, ischeckedIn,
    setIsCheckedIn, isOnBreak, setIsOnBreak, isCheckedOut, setIsCheckedOut} = useContext(authContext);

  const handleEndBrek = async()=>{
    let todayDate  = localStorage.getItem("todays_date")
    if(!todayDate || !localStorage.getItem("break_start_time")){
      alert(`${name}, You are not on break`)
    }
    else{
      try {
        // let nowDate = new Date();
        // const year = nowDate.getFullYear();
        // const month = nowDate.getMonth() + 1; // Months are zero-indexed in JavaScript
        // const day = nowDate.getDate();
  
        // const todayDate = `${year}-${month}-${day}`;
  
        const currentTime = new Date().toISOString(); // Get the current time in ISO format
        const authToken = localStorage.getItem("my_token");
        if(!authToken){
          setIsAuthenticated(false);
        }
        console.log(currentTime, todayDate);
        const response = await axios.post(`http://192.168.1.34:8000/api/emp/v1/endbreak`, {
          checkOutTime: currentTime,
          date : todayDate
        }, {
          headers: {
            'Authorization': `Bearer ${authToken}`, // Include the auth token in the headers
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 200) {
          console.log('Break stops:', response.data);
        } else {
          throw new Error(`Failed to stop break. Status: ${response.status}`);
        }
  
      } catch (error) {
        console.error('Error during Break stop:', error);
        // Handle error, display a message to the user, etc.
      }
      localStorage.removeItem("break_start_time");
  }
}
  return (
    <div>
      <button className='btn btn-hover' onClick={handleEndBrek}>Break End</button>
    </div>
  )
}

export default EndBreakButton

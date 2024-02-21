import React,{useContext} from 'react'
import { authContext} from '../App';
import axios from 'axios';

function CheckoutButton({name}) {
  const {isAuthenticated, setIsAuthenticated, ischeckedIn,
    setIsCheckedIn, isOnBreak, setIsOnBreak, isCheckedOut, setIsCheckedOut} = useContext(authContext);

  const handleChekout = async () => {
    let todayDate  = localStorage.getItem("todays_date")
    if(!todayDate){
      alert(`${name}, You are not checked in/ you are cheked out already`);
    }
    if(localStorage.getItem("break_start_time")){
      alert(`${name}, First end the break and then checkout.`);
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
        const response = await axios.post(`http://192.168.1.34:8000/api/emp/v1/checkout`, {
          checkOutTime: currentTime,
          date : todayDate
        }, {
          headers: {
            'Authorization': `Bearer ${authToken}`, // Include the auth token in the headers
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 200) {
          console.log('check out successful:', response.data);
        } else {
          throw new Error(`Failed to check out. Status: ${response.status}`);
        }
  
      } catch (error) {
        console.error('Error during check-out:', error);
        // Handle error, display a message to the user, etc.
      }
      localStorage.removeItem("todays_date");
      setIsCheckedIn(false);
      setIsOnBreak(false);
      setIsCheckedOut(false);
    }
  }
  return (
    <div>
      <button className='btn btn-hover' onClick={handleChekout}>Check out</button>
    </div>
  )
}
export default CheckoutButton
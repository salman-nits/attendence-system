import React,{useContext} from 'react'
import { authContext} from '../App';
import axios from 'axios';


function EndBreakButton({name}) {
  const {isAuthenticated, setIsAuthenticated, ischeckedIn,
    setIsCheckedIn, isOnBreak, setIsOnBreak, isCheckedOut, setIsCheckedOut} = useContext(authContext);

  const handleEndBrek = async()=>{
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

        const response = await axios.post(`https://attendence-system-psi.vercel.app/api/emp/v1/endbreak`, {
          checkOutTime: currentTime,
          date : todayDate
        }, {
          headers: {
            'Authorization': `Bearer ${authToken}`, // Include the auth token in the headers
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 200) {
          
          alert("Break sropped");
        }

      } catch (error) {
        // console.error('Error during Break stop:', error);
        if(error.response.status === 400){
          const errorMessege = error.response.data.message;
          alert(errorMessege);
        }
        // Handle error, display a message to the user, etc.
      }
  }

  return (
    <div>
      <button className='btn btn-hover' onClick={handleEndBrek}>Break End</button>
    </div>
  )
}

export default EndBreakButton

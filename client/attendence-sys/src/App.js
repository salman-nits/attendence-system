import './App.css';
import LoginPage from './pages/LoginPage';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import { createContext,  useEffect, useState } from 'react';
import axios from 'axios';
export const authContext = createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUserName] = useState('');
  const [ischeckedIn, setIsCheckedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isBreakEnd, setIsBreakEnd] = useState(false); 
  const [todaysDate, setTodaysDate] = useState("");
  
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(token){
      setIsAuthenticated(true);
    }else{
      setIsAuthenticated(false);
    }
  },[isAuthenticated])

  return (
    <authContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated,
      username,
      setUserName,
      ischeckedIn,
      setIsCheckedIn,
      isOnBreak,
      setIsOnBreak,
      isCheckedOut,
      setIsCheckedOut,
      isBreakEnd,
      setIsBreakEnd,
      todaysDate,
      setTodaysDate
    }}>
      <BrowserRouter>
        <Routes>
          <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
          <Route path='/login' element={<LoginPage></LoginPage>}></Route>
          <Route path='/signup' element={<SignupPage></SignupPage>}></Route>
        </Routes>
      </BrowserRouter>
    </authContext.Provider>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import SignUp from './pages/user/signup/signup';
import Nav from './components/header/nav';
import LogIn from './pages/user/login/login';
import MapPage from './pages/map/map';
import MateBoard from './pages/board/mateboard/mateboardlist';
import AddMatePost from './pages/board/mateboard/addmatepost';
import MateDetail from './pages/board/mateboard/matedetail';
import TripBoard from './pages/board/tripboard/tripboardlist';
import TripDetail from './pages/board/tripboard/tripdetail';
import AddTripPost from './pages/board/tripboard/addtrippost';
import Main from './pages/main/main';
import Filter from './pages/filter/filter-main/filter-main';
import Section from './pages/filter/section/section';
import Section2 from './pages/filter/section/section2';
import Result from './pages/filter/section/result';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Remove access token from local storage
    setIsLoggedIn(false);
    setNickname('');
    navigate('/');
  };

  // Function to check if user is logged in based on access token
  const checkLoggedIn = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // User is logged in
      setIsLoggedIn(true);
      const storedNickname = localStorage.getItem('nickname');
      if (storedNickname) {
        setNickname(storedNickname);
      } else {
        setNickname(''); // Ensure nickname is empty if not found in local storage
      }
    } else {
      // No access token found, user is logged out
      setIsLoggedIn(false);
      setNickname('');
    }
  };

  // useEffect to check login status when component mounts and on every render
  useEffect(() => {
    checkLoggedIn();
  }, []); // Run once when the component mounts

  // useEffect to clear localStorage when the app first starts
  useEffect(() => {
    localStorage.clear();
  }, []); 

  // useEffect to persist login state in local storage
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]); // Run whenever isLoggedIn state changes

  return (
    <div className="App">
      <Nav isLoggedIn={isLoggedIn} nickname={nickname} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<LogIn setIsLoggedIn={setIsLoggedIn} setNickname={setNickname} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/contact" element={<MapPage />}/>
        <Route path="/mateboard" element={<MateBoard />} />
        <Route path="/mateboard/:postId" element={<MateDetail />} />
        <Route path="/mate" element={<AddMatePost />} />
        <Route path="/tripboard" element={<TripBoard />} />
        <Route path="/tripboard/:postId" element={<TripDetail />} />
        <Route path="/trip" element={<AddTripPost />} />
        <Route path="/filter" element={<Filter isLoggedIn={isLoggedIn} nickname={nickname} />} />
        <Route path="/section" element={<Section />} />
        <Route path="/section2" element={<Section2 />} />
        <Route path="/result" element={<Result/>} />
      </Routes>
    </div>
  );
};

export default App;

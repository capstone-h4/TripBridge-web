import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
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
import { useNavigate } from 'react-router-dom';
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();
  // Function to handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    setNickname('');
    navigate('/');
  };

  const checkLoggedIn = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      setIsLoggedIn(true);
      const storedNickname = sessionStorage.getItem('nickname');
      if (storedNickname) {
        setNickname(storedNickname);
      } else {
        setNickname('');
      }
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  // 로그인 상태를 세션 스토리지에 저장
  useEffect(() => {
    if (isLoggedIn) {
      sessionStorage.setItem('accessToken', 'your_access_token_here');
      sessionStorage.setItem('nickname', nickname);
    }
  }, [isLoggedIn, nickname]);

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

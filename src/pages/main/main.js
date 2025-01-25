import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import './main.css';
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { TbCircleArrowRight } from "react-icons/tb";

const Container = styled.div`
  width: ${(props) => props.totalSlides * 100}vw;
  height: 88vh; /* Make the container full height */
  transition: transform 0.5s ease-in-out;
  transform: translateX(-${(props) => (props.currentSlide - 1) * 100}vw);
  overflow: hidden;
  display: flex;
`;

const Main = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [activeFunc, setActiveFunc] = useState(null);
  const slideInterval = useRef(null);
  const isTransitioning = useRef(false);
  const navigate = useNavigate();

  const getToken = () => {
    return sessionStorage.getItem('accessToken');
  };

  const startSlideShow = () => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev === 7 ? 1 : prev + 1));
    }, 3000);
  };

  const handleClickPrev = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    clearInterval(slideInterval.current);
    setCurrentSlide((prev) => (prev === 1 ? 7 : prev - 1));
    setTimeout(() => {
      isTransitioning.current = false;
      startSlideShow();
    }, 500);
  };

  const handleClickNext = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    clearInterval(slideInterval.current);
    setCurrentSlide((prev) => (prev === 7 ? 1 : prev + 1));
    setTimeout(() => {
      isTransitioning.current = false;
      startSlideShow();
    }, 500);
  };

  const handleLinkClick = (path) => {
    const token = getToken();
    if (!token) {
      setShowPopup(true);
    } else {
      navigate(path);
    }
  };

  const handleFuncClick = (funcNumber) => {
    setActiveFunc(activeFunc === funcNumber ? null : funcNumber);
  };

  useEffect(() => {
    startSlideShow();
    return () => clearInterval(slideInterval.current);
  }, []);

  return (
    <div className="main">
      <div className="banner-text">TRIP BRIDGE</div>
      <div className="banner-text2">나만의 여행을 즐길 수 있는 곳, 트립 브릿지</div>
      <div style={{ overflow: 'hidden' }}>
        <Container currentSlide={currentSlide} totalSlides={7}>
          <div className="inner">
            <div className="banner-container">
              <img src="./main/seoul.jpg" alt="배너1" className="Img" />
              <div className="overlay"></div>
              <div className="main-text">서울| 광화문</div>
            </div>
          </div>
          <div className="inner">
            <div className="banner-container">
              <img src="./main/suwon.jpg" alt="배너2" className="Img" />
              <div className="overlay"></div>
              <div className="main-text">경기| 수원화성</div>
            </div>
          </div>
          <div className="inner">
            <div className="banner-container">
              <img src="./main/gangwon.jpg" alt="배너3" className="Img" />
              <div className="overlay"></div>
              <div className="main-text">강원| 설악산</div>
            </div>
          </div>
          <div className="inner">
            <div className="banner-container">
              <img src="./main/jj.jpg" alt="배너4" className="Img" />
              <div className="overlay"></div>
              <div className="main-text">전주| 한옥마을</div>
            </div>
          </div>
          <div className="inner">
            <div className="banner-container">
              <img src="./main/busan.jpg" alt="배너5" className="Img" />
              <div className="overlay"></div>
              <div className="main-text">부산| 광안대교</div>
            </div>
          </div>
          <div className="inner">
            <div className="banner-container">
              <img src="./main/gj.jpg" alt="배너6" className="Img" />
              <div className="overlay"></div>
              <div className="main-text">경주| 안압지</div>
            </div>
          </div>
          <div className="inner">
            <div className="banner-container">
              <img src="./main/jeju.jpg" alt="배너7" className="Img" />
              <div className="overlay"></div>
              <div className="main-text">제주| 제주시 해변</div>
            </div>
          </div>
        </Container>
        <GrFormPrevious size={45} className="left-icon" onClick={handleClickPrev} />
        <GrFormNext size={45} className="right-icon" onClick={handleClickNext} />
      </div>

      <div className="func-container">
        <div className="func func1" onClick={() => handleFuncClick(1)}>
          여행지 추천
          {activeFunc === 1 && (
            <div className="detail">나만의 완벽한 여행지!<br />원하는 조건에 맞는 여행지를 쉽게 찾을 수 있습니다.</div>
          )}
          <Link to="/filter" className="moveto">
            <TbCircleArrowRight />
          </Link>
        </div>
        <div className="func func2" onClick={() => handleFuncClick(2)}>
          동선 추천
          {activeFunc === 2 && (
            <div className="detail">여행의 시작은 계획에서부터!<br /> 편리한 동선 설계로 여행 준비를 도와드립니다.</div>
          )}
          <div className="moveto" onClick={() => handleLinkClick('/map')}>
            <TbCircleArrowRight />
          </div>
        </div>
        <div className="func func3" onClick={() => handleFuncClick(3)}>
          여행 게시판
          {activeFunc === 3 && (
            <div className="detail">모두 함께 만드는 여행 커뮤니티!<br /> 여행 정보를 나누고 서로에게 영감을 주는 공간입니다.</div>
          )}
          <Link to="/tripboard" className="moveto">
            <TbCircleArrowRight />
          </Link>
        </div>
        <div className="func func4" onClick={() => handleFuncClick(4)}>
          여행 메이트 게시판
          {activeFunc === 4 && (
            <div className="detail">혼자보다 함께가 더 즐거운 여행!<br /> 마음 맞는 여행 메이트를 여기서 찾을 수 있습니다.</div>
          )}
          <Link to="/mateboard" className="moveto">
            <TbCircleArrowRight />
          </Link>
        </div>
      </div>
      <div className="footer">
        <div className="footer-text">ⓒ TripBridge. All Rights Reserved.</div>
      </div>

      {showPopup && (
        <div className="login-modal">
          <div className="login-modal-content">
            <p>동선 추천은 로그인 후 이용이 가능합니다. <br/> 로그인하시겠습니까?</p>
            <button onClick={() => { setShowPopup(false); navigate('/login'); }}>로그인</button>
            <button onClick={() => setShowPopup(false)}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;

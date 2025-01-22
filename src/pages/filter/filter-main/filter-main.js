import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlayCircle } from 'react-icons/fa'; // react-icons에서 FaPlayCircle 아이콘을 불러옵니다.


import './filter-main.css'; // 분리한 CSS 파일을 불러옵니다.

const Filter = ({ isLoggedIn, nickname }) => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleStartClick = (event) => {
    if (!isLoggedIn) {
      // 로그인하지 않은 경우 팝업을 띄우고 이동을 막음
      event.preventDefault();
      setShowPopup(true);
    }
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setShowPopup(false);
  };

  return (
    <div className="filtermain-container">
      <div className="container-box">
        <div className="filter-text">
        {!isLoggedIn && (
            <>
              <div className="text-user"> 환영합니다! </div>
            </>
          )}
          {isLoggedIn && (
            <>
              <div className="text-user"> {nickname} 님 환영합니다! </div>
            </>
          )}
          <div className="text-main">여행지 추천</div>

          <div className="text-ex">원하는 여행지를 찾기 어려우신가요?<br />
            취향에 맞는 여행을 선택하고 추천 받아보세요!
          </div>
        </div>
          <Link className="button-start" to='/section' onClick={handleStartClick}>
              <FaPlayCircle className="start-icon" />
              시작하기
            </Link>
      </div>
       {showPopup && (
          <div className="login-modal">
            <div className="login-modal-content">
              <p>로그인 후 이용이 가능합니다.<br/> 로그인 하시겠습니까?</p>
              <button onClick={() => { closeModal(); navigate('/login'); }}>로그인</button>
              <button onClick={closeModal}>취소</button>
            </div>
          </div>
        )}
    </div>
  );
};

export default Filter;
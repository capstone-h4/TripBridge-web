import React, { useState } from 'react';
import PropTypes from 'prop-types';
import  HeartImg  from "./img/scrap.png";
import  EmptyHeartImg  from "./img/empty_scrap.png";
import White from "./img/white-background.png";

import './result.css'

const HeartButton = ({ defaultLike, onClick }) => {
  const [like, setLike] = useState(defaultLike);

  const handleClick = () => {
    setLike(prevLike => !prevLike); // 클릭할 때마다 상태를 토글함
    onClick(); // 클릭 이벤트에 대한 콜백 함수 호출
  };

  return (
      <div>
    <img className="heart-button"
    src={like ? HeartImg : EmptyHeartImg} // 이미지 경로를 문자열로 설정
      // src={like ? {HeartImg} : {EmptyHeartImg}}
      // className="heart-button" // HeartButton에 대한 클래스 추가
      onClick={handleClick}
      alt="Heart"
    />
    <img className="white-background" src={White}/>
    </div>
    
  );
};
  export default HeartButton;
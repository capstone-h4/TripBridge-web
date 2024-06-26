import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { sendRequest, sendScrap, fetchEx} from '../../../api/filter';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaArrowAltCircleRight } from "react-icons/fa";
import { CiBookmarkCheck } from "react-icons/ci";
import { MdOutlineImageNotSupported } from "react-icons/md";

import './result.css';
//세션 스토리지 부분 2개 
const Result = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;
  const [scrapedPosts, setScrapedPosts] = useState([]);
  const [showScrapedPopup, setShowScrapedPopup] = useState(false);
  const [showAlreadyScrapedPopup, setShowAlreadyScrapedPopup] = useState(false);
  const [showExPopup, setShowExPopup] = useState(false);
  const [exPopupContent, setExPopupContent] = useState('');
  const [showAlreadyExPopup, setShowAlreadyExPopup] = useState(false);



  const location = useLocation();
  const { selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle, selectedCategoryThird} = location.state;


  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const resultData = await sendRequest(selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle, selectedCategoryThird);
        setPosts(resultData);
      } catch (error) {
        console.error('데이터 가져오기 오류_result.js:', error);
      }
    };

    fetchData();
  }, [selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle, selectedCategoryThird, currentPage]); // currentPage를 의존성 배열에 추가하여 페이지가 변경될 때마다 데이터를 다시 불러옴

  useEffect(() => {
    // 세션 스토리지에서 스크랩된 게시물 상태 불러오기
    const savedScrapedPosts = sessionStorage.getItem('scrapedPosts');
    if (savedScrapedPosts) {
      setScrapedPosts(JSON.parse(savedScrapedPosts));
    }
  }, []); // 컴포넌트가 처음 마운트될 때만 실행되도록 빈 의존성 배열 추가


// 스크랩(좋아요) 버튼 클릭 시 실행되는 함수
const handleScrap = async (place, address, longitude, latitude) => {
  try {
    const scrapData = {
      place: place,
      address: address,
      longitude: longitude,
      latitude: latitude
    };

    console.log('스크랩 요청 데이터:', scrapData);
    if (scrapedPosts.some(post => post.place === place && post.address === address)) {
      setShowAlreadyScrapedPopup(true);
      return;
    }
    await sendScrap(scrapData);
    setShowScrapedPopup(true)
    
    // 게시물을 고유하게 식별할 수 있는 속성을 사용하여 게시물의 liked 상태를 업데이트
    setPosts(posts.map(post => {
      if (post.place === place && post.address === address) {
        return { ...post, liked: !post.liked };
      }
      return post;
    }));
  } catch (error) {
    console.error('스크랩 요청 오류:', error);
    setShowAlreadyScrapedPopup(true);
  }
};

//이미지 띄우면 상세 설명
const handleImageClick = async (contentTypeId,contentId) => {
  try {
    const exData = {
      contentTypeId: contentTypeId,
      contentId: contentId,
    };

    console.log('상세설명 요청 데이터:', exData);
    // fetchEx 함수 호출 및 결과를 변수에 할당
    const responseData = await fetchEx(exData);
    
    // 반환된 데이터를 이용하여 원하는 작업 수행
    console.log('받은 이미지 데이터:', responseData);

    const cleanedData = responseData.replace(/<[^>]*>/g, '');

    setExPopupContent(cleanedData);
    setShowExPopup(true);
    
    
  } catch (error) {
    console.error('상세설명 요청 오류:', error);
    setShowAlreadyExPopup(true);
  }
};

  // 현재 페이지의 게시물 가져오기
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

// 페이지네이션 클릭
const paginate = (pageNumber) => {
  // 다음 페이지 범위로 이동할 때
  if (pageNumber === currentPage + 10) {
    setCurrentPage(pageNumber); // 다음 페이지로 이동
  } 
  // 이전 페이지 범위로 이동할 때
  else if (pageNumber === currentPage - 10) {
    setCurrentPage(pageNumber); // 이전 페이지로 이동
  } 
  else {
    setCurrentPage(pageNumber); // 일반적인 페이지 이동
  }
};


  return (
    <div className="result-container">
      <motion.div className="result-container-box" animate={{ y: -100 }}>
        <div className="result-section-box">
        <div className="section-textbox">추천 관광지<Link className="toscrap" to="/map"><FaArrowAltCircleRight />스크랩 목록 확인하러 가기</Link></div>
           {/* 백엔드에서 가져온 게시물 데이터를 표시하는 부분 */}
          <div className="result-wrapper">
            {currentPosts.map(post => (
              <div className="result" key={post.contentId}>
              <div className="result_img_div">

                {post.image ? (
                  <img src={post.image} className="result_img" alt={post.place || "이미지 없음"} onClick={() => handleImageClick(post.contentTypeId, post.contentId)}/>
                ) : (
                  <MdOutlineImageNotSupported className="result_img2" onClick={() => handleImageClick(post.contentTypeId, post.contentId)}/>
                )}

              </div>
                <button onClick={() => handleScrap(post.place, post.address, post.longitude, post.latitude)} className="scrapbutton">
                <CiBookmarkCheck />
                </button>
                <div className='result-t'>
                <div className="result_title">{post.place || "제목 없음"}</div>
                <div className="result_title2">{post.address}</div>
                </div>
              </div>
            ))}
          </div>
          {/* 페이지 네이션 */}
          <div className="pagination1">
            <button
              disabled={currentPage === 1} // 현재 페이지가 1페이지면 비활성화
              onClick={() => paginate(Math.max(1, currentPage - 10))} // 이전 페이지 범위로 이동하는 함수 호출
            >
              {"<<"}
            </button>
            {Array.from({ length: Math.min(10, Math.ceil(posts.length / postsPerPage)) }, (_, i) => {
              const pageNumber = ((Math.ceil(currentPage / 10) - 1) * 10) + i + 1;
              if (pageNumber > Math.ceil(posts.length / postsPerPage)) return null; // 페이지 범위를 벗어나면 버튼을 렌더링하지 않음
              return (
                <button 
                  key={pageNumber} 
                  className={currentPage === pageNumber ? "active" : ""} // 현재 페이지와 일치할 때 active 클래스 추가
                  onClick={() => paginate(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              disabled={currentPage + 10 >= Math.ceil(posts.length / postsPerPage)} // 현재 페이지가 마지막 페이지 범위의 시작 페이지와 가까울 때 비활성화
              onClick={() => paginate(currentPage + 10)} // 다음 페이지 범위로 이동하는 함수 호출
            >
              {">>"}
            </button>
          </div>
        </div>
      </motion.div>
      {/* Scraped Popup */}
      {showScrapedPopup && (
        <div className="popup-result">
          <div className="popup-inner1">
            <p>   스크랩 되었습니다.   </p>
            <button onClick={() => setShowScrapedPopup(false)}>확인</button>
          </div>
        </div>
      )}

      {/* Already Scraped Popup */}
      {showAlreadyScrapedPopup && (
        <div className="popup-result">
          <div className="popup-inner2">
            <p>이미 스크랩 된 장소입니다.</p>
            <button onClick={() => setShowAlreadyScrapedPopup(false)}>확인</button>
          </div>
        </div>
      )}

      {/* Ex Popup */}
      {showExPopup && (
        <div className="Ex-popup-result">
          <div className="Ex-popup-inner1">
          <p className="centered-text">상세정보</p>
          <div className="ex-containter"><p className="ex-text">{exPopupContent}</p></div>
          {/* <p className="ex-text">{exPopupContent}</p> */}
            <button onClick={() => setShowExPopup(false)}>닫기</button>
          </div>
        </div>
      )}

       {/* Already Ex Popup */}
       {showAlreadyExPopup && (
        <div className="popup-result">
          <div className="popup-inner2">
            <p>상세 정보가 없습니다!</p>
            <button onClick={() => setShowAlreadyExPopup(false)}>확인</button>
          </div>
        </div>
      )}

    </div>
    
    

    
  );
};

export default Result;

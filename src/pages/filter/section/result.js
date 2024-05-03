import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { sendRequest, sendScrap, deleteScrap } from '../../../api/filter';
import image from './img/no_img.jpg';
import HeartButton from './heart';
import { useLocation, useParams } from 'react-router-dom';
import './result.css';

const Result = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 15;
  // const [scrapId, setScrapId] = useState(null);
  // const { scrapId: routeScrapId } = useParams();
  

  // Load scrapped items from local storage on component mount and when currentPage changes
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('scrappedPosts'));
    if (savedPosts) {
      setPosts(savedPosts);
    }
  }, [currentPage]);

  const location = useLocation();
  const { selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle, selectedCategoryThird} = location.state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultData = await sendRequest(selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle, selectedCategoryThird, currentPage);
        // Add 'liked' property to each item
        const postsWithLiked = resultData.map(post => ({ ...post, liked: false }));
        // Extract and store IDs
        const postIDs = resultData.map(post => post.id);
        localStorage.setItem('postIDs', JSON.stringify(postIDs)); // Store IDs in localStorage
        setPosts(postsWithLiked);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle, selectedCategoryThird]);

  const handleScrap = async (place, address, longitude, latitude) => {
    try {
      const scrapData = {
        place: place,
        address: address,
        longitude: longitude,
        latitude: latitude
      };
  
      // 로컬 스토리지에서 기존에 저장된 스크랩 데이터 가져오기
      const existingScrappedPosts = JSON.parse(localStorage.getItem('scrappedPosts')) || [];
  
      // 스크랩된 상태인지 확인
      const isScrapped = existingScrappedPosts.some(post => post.place === place && post.address === address);
  
      if (isScrapped) {
        // 이미 스크랩된 상태이면 삭제 요청 보내기
        // 스크랩된 항목의 ID를 찾아서 삭제
        // const postIDs = JSON.parse(localStorage.getItem('postIDs')); // Retrieve stored IDs
        const scrapIdToDelete = existingScrappedPosts.find(post => post.place === place && post.address === address).id;

        if (scrapIdToDelete) {
          console.log("Existing Scrapped Posts:", existingScrappedPosts);
          const scrapIdToDelete = existingScrappedPosts.find(post => post.place === place && post.address === address)?.id;
          console.log("Scrap ID to Delete:", scrapIdToDelete);
        } else {
          console.error('Failed to find ID for deletion.');
          return;
        }
      } else {
        // 스크랩 요청 보내기
        await sendScrap(scrapData);
        console.log(existingScrappedPosts);
      }
  
      // 스크랩 상태 업데이트
      setPosts(posts =>
        posts.map(post => {
          if (post.place === place && post.address === address) {
            return { ...post, liked: !isScrapped };
          }
          return post;
        })
      );
  
      // 로컬 스토리지 업데이트
      if (isScrapped) {
        // 이미 스크랩된 상태이면 삭제된 항목을 로컬 스토리지에서 제거
        const updatedScrappedPosts = existingScrappedPosts.filter(post => !(post.place === place && post.address === address));
        localStorage.setItem('scrappedPosts', JSON.stringify(updatedScrappedPosts));
      } else {
        // 스크랩된 항목을 추가하여 로컬 스토리지에 저장
        const newScrappedPost = {
          place: place,
          address: address,
          longitude: longitude,
          latitude: latitude,
          liked: true
        };
        const updatedScrappedPosts = [...existingScrappedPosts, newScrappedPost];
        localStorage.setItem('scrappedPosts', JSON.stringify(updatedScrappedPosts));
      }
    } catch (error) {
      console.error('스크랩 요청 에러:', error);
    }
  };
  


  
  

  // 현재 페이지의 게시물 가져오기
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // 페이지네이션 클릭
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="result-container">
      <motion.div className="result-container-box" animate={{ y: -100 }}>
        <div className="section-box">
          <div className="section-text-box">
            <p className="text">여행지 추천 장소 입니다!</p>
          </div>

           {/* 백엔드에서 가져온 게시물 데이터를 표시하는 부분 */}
          <div className="result-wrapper">
            {currentPosts.map(post => (
              <div className="result" key={post.id}>
                <div className="result_img_div">
                  <img src={post.image || image} className="result_img" alt={post.place || "이미지 없음"} />
                </div>
                <HeartButton 
                  defaultLike={false}
                  onClick={() => handleScrap(post.place, post.address, post.longitude, post.latitude)}
                />
                <h5 className="result_title">{post.place || "제목 없음"}</h5>
              </div>
            ))}
          </div>

          {/* 페이지 네이션 */}
          <div className="pagination1">
            <button
              disabled={currentPage === 1} // 현재 페이지가 1페이지면 비활성화
              onClick={() => paginate(1)} // 맨 처음 페이지로 이동하는 함수 호출
            >
              {"<<"}
            </button>
            {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, i) => {
              const startPage = currentPage <= 5 ? 1 : currentPage - 4; // Calculate the start page of the range
              const endPage = Math.min(startPage + 9, Math.ceil(posts.length / postsPerPage)); // Calculate the end page of the range
              if (i + 1 >= startPage && i + 1 <= endPage) { // Only render buttons within the range
                return (
                  <button 
                    key={i + 1} 
                    className={currentPage === i + 1 ? "active" : ""} // 현재 페이지와 일치할 때 active 클래스 추가
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </button>
                );
              }
              return null; // Render nothing for pages outside the range
            })}
            <button
              disabled={currentPage === Math.ceil(posts.length / postsPerPage)} // 현재 페이지가 마지막 페이지면 비활성화
              onClick={() => paginate(Math.ceil(posts.length / postsPerPage))} // 맨 마지막 페이지로 이동하는 함수 호출
            >
              {">>"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Result;
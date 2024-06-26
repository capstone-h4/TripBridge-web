import React, { useState, useEffect } from 'react';
import './tripboardlist.css';
import { Link, useNavigate } from 'react-router-dom';
import { showTripPost } from '../../../api/tripboard';
import { LuPencil } from "react-icons/lu";

const getToken = () => {
  return sessionStorage.getItem('accessToken');
};

const TripPostList = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태 추가
  const postsPerPage = 15;
  const navigate = useNavigate();

  useEffect(() => {
    const showpost = async () => {
      try {
        const data = await showTripPost();
        setPosts(data);
      } catch (error) {
        console.error('게시물 불러오기 오류:', error);
      }
    };
    showpost();
  }, []);

  // 현재 페이지의 게시물
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // 날짜 형식화 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1, 두 자리로 포맷
    let day = date.getDate().toString().padStart(2, '0'); // 두 자리로 포맷
    return `${year}-${month}-${day}`;
  };

  // 페이지네이션 클릭
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 글쓰기 버튼 클릭
  const handleWritePostClick = () => {
    const token = getToken();
    if (!token) {
      setShowModal(true); // 모달 열기
    } else {
      navigate('/trip');
    }
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div className='trip-board-banner'>
        <img src='/board/trip.jpg' alt='' />
        <div className="trip-board-main">여행 게시판</div>
      </div>
      <div className="trip-board-container">
        <div className="post-header">
          <div className="post-header-item">번호</div>
          <div className="post-header-item">제목</div>
          <div className="post-header-item">작성자</div>
          <div className="post-header-item">작성일</div>
        </div>
        <div className="post-list">
          {currentPosts.map((post, index) => (
            <div className={`post-item ${index === currentPosts.length - 1 ? 'last-item' : ''}`} key={post.id}>
              <div className="post-content">
                <div className="post-data">{posts.length - indexOfFirstPost - index}</div>
                <div className="post-data">
                  <Link to={`/tripboard/${post.id}`} className="post-title">{post.title}</Link>
                </div>
                <div className="post-data">{post.user}</div>
                <div className="post-data">{formatDate(post.date)}</div>
              </div>
            </div>
          ))}
        </div>
        {/* 페이지 네이션 */}
        <div className="pagination">
          {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button onClick={handleWritePostClick} className="write-post-button">
          <LuPencil />&nbsp;글쓰기
        </button>

        {/* 로그인 확인 모달 */}
        {showModal && (
          <div className="login-modal">
          <div className="login-modal-content">
            <p>로그인이 필요합니다. 로그인 하시겠습니까?</p>
            <button onClick={() => { closeModal(); navigate('/login'); }}>로그인</button>
            <button onClick={closeModal}>취소</button>
          </div>
        </div>
        )}

      </div>
      <div className="footer">
        <div className="footer-text">ⓒ TripBridge. All Rights Reserved.</div>
      </div>
    </div>
  );
};

export default TripPostList;

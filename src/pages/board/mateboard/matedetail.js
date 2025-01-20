import React, { useState, useEffect } from 'react';
import { getMatePostDetail, saveComment, getComments, deleteComment, deletePost, updatePost } from '../../../api/mateboard';
import { useParams, useNavigate } from 'react-router-dom';
import './matedetail.css';

const getToken = () => {
  return sessionStorage.getItem('accessToken');
};

const getLoggedInUser = () => {
  return sessionStorage.getItem('nickname');
};

const MateDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [comment, setComment] = useState('');
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyingToContent, setReplyingToContent] = useState('');
  const [replyingToUser, setReplyingToUser] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const navigate = useNavigate();
  const loggedInUser = getLoggedInUser();
  const [showLoginPopup, setShowLoginPopup] = useState(false); // 모달 표시 상태 추가
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  // 모달 닫기 함수
  const closeModal = () => {
    setShowLoginPopup(false);
    setShowDeletePostModal(false);
    setShowDeleteCommentModal(false);
    setCommentToDelete(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postData = await getMatePostDetail(postId);
        setPost(postData);
        const commentsData = await getComments(postId);
        setCommentList(commentsData);
      } catch (error) {
        console.error('데이터 불러오기 중 에러 발생:', error);
      }
    };
    fetchData();
  }, [postId]);

  const handleDeletePost = async () => {
    setShowDeletePostModal(true);
  };

  const confirmDeletePost = async () => {
    try {
      const commentsData = await getComments(postId);
      for (const comment of commentsData) {
        await deleteComment(comment.id);
      }
      await deletePost(postId);
      console.log('게시글과 댓글이 성공적으로 삭제되었습니다.');
      navigate('/mateboard');
    } catch (error) {
      console.error('게시글 또는 댓글 삭제 중 오류 발생:', error);
    }
  };

  const handleEditPost = () => {
    setIsEditing(true);
    setEditedTitle(post.title);
    setEditedContent(post.content);
  };

  const handleChangeEditedTitle = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleChangeEditedContent = (e) => {
    setEditedContent(e.target.value);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      if (!token) {
        console.error('로그인이 필요합니다.');
        return;
      }
      const editedPostData = {
        title: editedTitle,
        content: editedContent,
      };
      await updatePost(postId, editedPostData, { headers: { Authorization: `Bearer ${token}` } });
      console.log('게시글 수정 성공');
      setPost((prevPost) => ({
        ...prevPost,
        title: editedTitle,
        content: editedContent,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('게시글 수정 오류:', error);
    }
  };

  const handleChangeComment = (e) => {
    const { value } = e.target;
    setComment(value);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      console.error('댓글을 입력해주세요.');
      return;
    }
    try {
      const token = getToken();
      if (!token) {
        setShowLoginPopup(true);
        return;
      }
      const commentData = {
        matePostId: postId,
        content: comment,
      };
      await saveComment(commentData, { headers: { Authorization: `Bearer ${token}` } });
      console.log('댓글 작성 성공');
      const updatedComments = await getComments(postId);
      setCommentList(updatedComments);
      setComment('');
    } catch (error) {
      console.error('댓글 작성 오류:', error);
    }
  };

  const handleReply = (commentId, user) => {
    setReplyingToId(commentId);
    setReplyingToUser(user);
    setReplyingToContent(`@${user} `);
  };

  const handleChangeReplyContent = (e) => {
    const { value } = e.target;
    setReplyingToContent(value);
  };

  const handleSubmitReply = async (e, parentId) => {
    e.preventDefault();
    if (!replyingToContent.trim()) {
      console.error('댓글을 입력해주세요.');
      return;
    }
    try {
      const token = getToken();
      if (!token) {
        setShowLoginPopup(true);
        return;
      }
      const commentData = {
        matePostId: postId,
        content: replyingToContent,
        parentCommentId: parentId,
      };
      await saveComment(commentData, { headers: { Authorization: `Bearer ${token}` } });
      console.log('대댓글 작성 성공');
      const updatedComments = await getComments(postId);
      setCommentList(updatedComments);
      setReplyingToContent('');
      setReplyingToId(null);
      setReplyingToUser('');
    } catch (error) {
      console.error('대댓글 작성 오류:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteCommentModal(true);
  };

  const confirmDeleteComment = async () => {
    try {
      await deleteComment(commentToDelete);
      console.log('댓글이 성공적으로 삭제되었습니다.');
      const updatedComments = await getComments(postId);
      setCommentList(updatedComments);
      closeModal();
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const formatCommentDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const renderComments = (comments, isNewComment = false) => {
    let commentGroups = {};
  
    comments.forEach((comment, index) => {
      const depth = comment.depth || 1;
      if (!commentGroups[depth]) {
        commentGroups[depth] = [];
      }
      commentGroups[depth].push(comment);
    });
  
    return Object.entries(commentGroups).map(([depth, comments]) => (
      <div key={depth}>
        {comments.map((comment, index) => (
          <div key={index} className={`comment-container depth-${depth} ${isNewComment ? 'new-comment' : ''}`}>
            <div className="comment-box">
              <>
                <div className="info">
                  <span>{comment.user} | {formatCommentDate(comment.date)}</span>
                  <div>
                    {loggedInUser && comment.user === loggedInUser && (
                      <button type="button" onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                    )}
                    <button type="button" onClick={() => handleReply(comment.id, comment.user)}>답글</button>
                  </div>
                </div>
                <div className="content-box">{comment.content}</div>
              </>
            </div>
            {replyingToId === comment.id && (
              <form onSubmit={(e) => handleSubmitReply(e, comment.id)}>
                <textarea
                  value={replyingToContent}
                  onChange={handleChangeReplyContent}
                  placeholder={`@${replyingToUser}`}
                ></textarea>
                <button type="submit">답글 작성</button>
              </form>
            )}
            {comment.children && renderComments(comment.children)}
          </div>
        ))}
      </div>
    ));    
  };

  return (
    <div className="container">
      <div className="matepost-details">
        {isEditing ? (
          <div className="edit-form">
            <form onSubmit={handleSubmitEdit}>
              <input 
                type="text" 
                value={editedTitle} 
                onChange={handleChangeEditedTitle} 
                placeholder="제목을 입력하세요" 
              />
              <textarea 
                value={editedContent} 
                onChange={handleChangeEditedContent}
                placeholder="내용을 입력하세요" 
              ></textarea>
              <div className="action-buttons">
                <button type="submit">수정 완료</button>
                <button type="button" onClick={() => setIsEditing(false)}>취소</button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="matepost-title">{post && post.title}</div>
            <div className="matepost-info">{post && post.user}&nbsp;|&nbsp;{post && formatDate(post.date)}</div>
            <div className="content-box pre-wrap">
              <div className="matepost-content">{post && post.content}</div>
            </div>
            {loggedInUser && post && loggedInUser === post.user && (
            <div className="action-buttons">
              <button onClick={handleDeletePost}>삭제</button>
              <button onClick={handleEditPost}>수정</button>
            </div>
          )}
          </>
        )}
      </div>
      <div className="comment-header">댓글</div>
      <div className="comment-section">
        <form onSubmit={handleSubmitComment}>
          <textarea value={comment} placeholder='댓글을 입력해주세요.' onChange={handleChangeComment}></textarea>
          <button type="submit">댓글 작성</button>
        </form>
        <div className='comment-list'>
          <div className='comment-semiheader'>댓글 목록</div>
          {renderComments(commentList, true)}
        </div>
      </div>
              {/* 모달 */}
              {showLoginPopup && (
          <div className="login-modal">
            <div className="login-modal-content">
              <p>로그인이 필요합니다. 로그인 하시겠습니까?</p>
              <button onClick={() => { closeModal(); navigate('/login'); }}>로그인</button>
              <button onClick={closeModal}>취소</button>
            </div>
          </div>
        )}
        {showDeletePostModal && (
          <div className="delete-modal">
            <div className="delete-modal-content">
              <p>게시글을 삭제하시면 다시 복구할 수 없습니다. <br/>정말 게시글을 삭제하시겠습니까?</p>
              <button onClick={() => { confirmDeletePost(); closeModal(); }}>확인</button>
              <button onClick={closeModal}>취소</button>
            </div>
          </div>
        )}
        {showDeleteCommentModal && (
          <div className="delete-modal">
            <div className="delete-modal-content">
              <p>정말로 이 댓글을 삭제하시겠습니까?</p>
              <button onClick={() => { confirmDeleteComment(); closeModal(); }}>확인</button>
              <button onClick={closeModal}>취소</button>
            </div>
          </div>
        )}
    </div>
  );
};

export default MateDetail;

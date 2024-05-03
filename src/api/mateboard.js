import axios from 'axios';

const BASE_URL = 'http://3.35.115.71:8080';



//메이트 게시물 불러오는 함수
export const showMatePost = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/mate`);
    return response.data.map(post => ({
      id: post.id,
      title: post.title,
      user : post.userEntity ? post.userEntity.nickname : 'Unknown',
      date: post.created_at
    }));
  } catch (error) {
    console.error('게시물 불러오기 오류:', error);
    throw error;
  }
};


//메이트 게시물 디테일
export const getMatePostDetail = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/mate/${id}`);
    return {
      id: response.data.id,
      title: response.data.title,
      content: response.data.content,
      user : response.data.userEntity ? response.data.userEntity.nickname : 'Unknown',
      date: response.data.created_at
    };
  } catch (error) {
    console.error('게시글 상세 정보 불러오기 오류:', error);
    throw error;
  }
};

//댓글,대댓글 보여주는 함수
export const getComments = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/mate/${id}/comment`);
    const comments = response.data.map(comment => ({
      id: comment.id,
      content: comment.content,
      date: comment.created_at,
      user: comment.userEntity ? comment.userEntity.nickname : 'Unknown',
      parentId: comment.parentComment ? comment.parentComment.id : null, // 부모 댓글의 ID
      group: comment.comment_group // 댓글의 그룹 정보
    }));

    // 부모 댓글과 자식 댓글을 매핑하여 구조 변경
    const commentMap = new Map();
    comments.forEach(comment => {
      if (!commentMap.has(comment.id)) {
        commentMap.set(comment.id, comment);
      }
      if (comment.parentId !== null) {
        const parentComment = commentMap.get(comment.parentId);
        if (!parentComment.children) {
          parentComment.children = [];
        }
        parentComment.children.push(comment);
      }
    });

    // 그룹별로 댓글을 모아 반환
    const rootComments = [];
    const groupMap = new Map();
    comments.forEach(comment => {
      if (comment.parentId === null) {
        if (!groupMap.has(comment.group)) {
          groupMap.set(comment.group, []);
        }
        groupMap.get(comment.group).push(comment);
      }
    });
    groupMap.forEach(groupComments => {
      rootComments.push(...groupComments);
    });

    return rootComments;
  } catch (error) {
    console.error('댓글 불러오기 실패', error);
    throw error;
  }
};


// 토큰 가져오기 함수
const getToken = () => {
  return localStorage.getItem('accessToken');
};




// 댓글 작성하기 함수
export const saveComment = async (commentData) => {
  try {
    const token = getToken();
    if (!token) {
      console.error('로그인이 필요합니다.');
      return;
    }

    const response = await axios.post(`${BASE_URL}/mate/comment`, commentData, {
      headers: {
        Authorization: `Bearer ${token}` // 헤더에 토큰 추가
      }
    });
    return response.data; // 서버로부터의 응답 데이터를 반환
  } catch (error) {
    console.error('댓글 저장 실패:', error);
    throw error; // 에러를 호출자에게 다시 던짐
  }
};

// 댓글 삭제 함수
export const deleteComment = async (commentId) => {
  try {
    const token = getToken();
    if (!token) {
      console.error('로그인이 필요합니다.');
      return;
    }

    const response = await axios.delete(`${BASE_URL}/mate/comment/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}` // 헤더에 토큰 추가
      }
    });
    return response.data; // 서버로부터의 응답 데이터를 반환
  } catch (error) {
    console.error('댓글 삭제 실패:', error);
    throw error; // 에러를 호출자에게 다시 던짐
  }
};

// 댓글 수정 함수
export const updateComment = async (commentId, updatedCommentData) => {
  try {
    const token = getToken();
    if (!token) {
      console.error('로그인이 필요합니다.');
      return;
    }

    const response = await axios.patch(`${BASE_URL}/mate/comment/${commentId}`, updatedCommentData, {
      headers: {
        Authorization: `Bearer ${token}` // 헤더에 토큰 추가
      }
    });
    return response.data; // 서버로부터의 응답 데이터를 반환
  } catch (error) {
    console.error('댓글 수정 실패:', error);
    throw error; // 에러를 호출자에게 다시 던짐
  }
};


// 글쓰기 함수
export const savePost = async (postData) => {
  try {
    const token = getToken();
    if (!token) {
      console.error('로그인이 필요합니다.');
      return;
    }

    const response = await axios.post(`${BASE_URL}/mate`, postData, {
      headers: {
        Authorization: `Bearer ${token}` // 헤더에 토큰 추가
      }
    });
    return response.data; // 서버로부터의 응답 데이터를 반환
  } catch (error) {
    console.error('게시글 저장 실패:', error);
    throw error; // 에러를 호출자에게 다시 던짐
  }
};


// 게시글 삭제 함수
export const deletePost = async (postId) => {
  try {
    const token = getToken();
    if (!token) {
      console.error('로그인이 필요합니다.');
      return;
    }

    const response = await axios.delete(`${BASE_URL}/mate/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}` // 헤더에 토큰 추가
      }
    });
    return response.data; // 서버로부터의 응답 데이터를 반환
  } catch (error) {
    console.error('게시글 삭제 실패:', error);
    throw error; // 에러를 호출자에게 다시 던짐
  }
};

// 게시글 수정 함수
export const updatePost = async (postId, updatedPostData) => {
  try {
    const token = getToken();
    if (!token) {
      console.error('로그인이 필요합니다.');
      return;
    }

    const response = await axios.patch(`${BASE_URL}/mate/${postId}`, updatedPostData, {
      headers: {
        Authorization: `Bearer ${token}` // 헤더에 토큰 추가
      }
    });
    return response.data; // 서버로부터의 응답 데이터를 반환
  } catch (error) {
    console.error('게시글 수정 실패:', error);
    throw error; // 에러를 호출자에게 다시 던짐
  }
};

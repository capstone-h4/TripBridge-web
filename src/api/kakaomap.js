import axios from 'axios';

const BASE_URL = 'https://api.tripbridge.co.kr';
// const BASE_URL ='http://localhost:8080'

const getToken = () => {
  return sessionStorage.getItem('accessToken');
};

export const fetchLocations = async () => {
  try {
    const userToken = getToken();
    if (!userToken) {
      throw new Error('유저를 찾을 수 없습니다');
    }
    const response = await axios.get(`${BASE_URL}/scrap`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });

    return response.data.map(location => ({
      id: location.id,  
      place: location.place,
      address: location.address,
      latitude:(location.latitude),
      longitude:(location.longitude)
    }));
  } catch (error) {
    console.error('위치 데이터를 불러오는데 오류가 발생했습니다 :', error);
    return []; // 오류 발생 시 빈 배열 반환
  }
};

//스크랩 삭제
export const deleteScrap = async (scrapId) => {
  try {
    const token = getToken();
    if (!token) {
      console.error('로그인이 필요합니다.');
      return;
    }
    const response = await axios.delete(`${BASE_URL}/storage/${scrapId}`, {
      headers: {
        Authorization: `Bearer ${token}` // 헤더에 토큰 추가
      }
    });
    return response.data; // 서버로부터의 응답 데이터를 반환
  } catch (error) {
    console.error('스크랩 삭제 실패:', error);
    throw error; // 에러를 호출자에게 다시 던짐
  }
};


export const sendSelectedLocations = async (location, routeorder) => {
  try {
    const userToken = getToken();
    if (!userToken) {
      throw new Error('유저를 찾을 수 없습니다');
    }

    // 클라이언트에서 서버로 보낼 데이터
    const postData = {
      id: location.id,  
      place: location.place,
      address: location.address,
      latitude: parseFloat(location.latitude).toFixed(6),  // 위도 소수점 6자리로 변환
      longitude: parseFloat(location.longitude).toFixed(6), // 경도 소수점 6자리로 변환
      routeOrder: routeorder > 1 ? null : routeorder // routeOrder가 1 초과일 경우에는 null로 설정
    };

    console.log('보내는 데이터:', postData);

    // "/route" 엔드포인트에 데이터 전송
    await fetch(`${BASE_URL}/route`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    console.log('선택한 위치 데이터를 "/route" 엔드포인트에 서버에 전송했습니다.');

    // "/route/update" 엔드포인트에 데이터 전송하고 업데이트된 데이터 받기
    await fetch(`${BASE_URL}/route/update`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    console.log('이전 데이터를 삭제하는 DELETE 요청을 "/route/chat" 엔드포인트에 보냈습니다.');

    // "/route" 엔드포인트에서 업데이트된 데이터 가져오기
    const responseData = await fetch(`${BASE_URL}/route`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });

    let routeData = await responseData.json();
    console.log('"/route" 엔드포인트에서 업데이트된 데이터를 받았습니다.', routeData);

    // 받은 데이터를 routeOrder 값을 기준으로 정렬합니다.
    routeData = routeData.sort((a, b) => a.routeOrder - b.routeOrder);

    return routeData;
    
  } catch (error) {
    console.error('선택한 위치 데이터를 서버에 전송하거나 받아오는 중 오류가 발생했습니다:', error);
    throw error;
  }
};

export const sendRouteDataToDatabase = async (routeData) => {
  try {
    const userToken = getToken();
    if (!userToken) {
      throw new Error('유저를 찾을 수 없습니다');
    }

    // "/route/chat" 엔드포인트에 데이터 전송
    await fetch(`${BASE_URL}/route/chat`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(routeData)
    });

    console.log('route/chat 데이터 리셋');

    // "/route/chat" 엔드포인트에 데이터 전송
    await fetch(`${BASE_URL}/route/chat`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(routeData)
    });

    console.log('정렬된 데이터를 다른 데이터베이스의 "/route/chat" 엔드포인트에 서버에 전송했습니다.');

    // "/route" 엔드포인트의 데이터 삭제
    await fetch(`${BASE_URL}/route`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });

    console.log('동선 데이터를 삭제하는 DELETE 요청을 보냈습니다.');

  } catch (error) {
    console.error('데이터를 다른 데이터베이스로 전송하는 중 오류가 발생했습니다:', error);
    throw error;
  }
};


// 저장된 동선을 백엔드로 전송하는 함수
export const saveRoute = async () => {
  try {
    const token = getToken();
    console.log('Token:', token); // 토큰 확인

    const response = await fetch(`${BASE_URL}/myroute`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Response status:', response.status); // 응답 상태 확인

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to save route: ${errorMessage}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Error saving route:', error.message);
    throw error;
  }
};


// Kakao Maps API 키
const API_KEY = '41269fe83b2600b01b0dc41c4d81616e';

// 장소 검색 함수
export const searchLocations = async (query) => {
  try {
    // Kakao Maps API의 장소 검색 엔드포인트 URL
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}`;

    // API 요청을 보내기 위한 설정
    const config = {
      headers: {
        Authorization: `KakaoAK ${API_KEY}` // API 키를 헤더에 추가
      }
    };
    // Axios를 사용하여 GET 요청을 보냄
    const response = await axios.get(url, config);

    // API 응답에서 검색 결과를 추출하여 반환
    return response.data.documents;
  } catch (error) {
    // 오류 발생 시 오류 객체를 throw
    throw error;
  }
};
import axios from 'axios';

const BASE_URL = 'https://api.tripbridge.co.kr';
// const BASE_URL = 'http://localhost:8080';

export const sendRequest = async (selectedAreas, selectedTourType, selectedCategory, selectedCategoryMiddle,selectedCategoryThird) => {
  try {
    // 선택한 지역 정보와 관광 타입, 카테고리 정보 등을 쿼리 문자열로 조합
    const queryString = `areaCode=${encodeURIComponent(selectedAreas)}&contentTypeId=${encodeURIComponent(selectedTourType)}&cat1=${encodeURIComponent(selectedCategory)}&cat2=${encodeURIComponent(selectedCategoryMiddle)}&cat3=${encodeURIComponent(selectedCategoryThird)}`;
    
    // 요청 URL 생성
    const requestURL = `${BASE_URL}/place/list?${queryString}`;

    console.log('Request_api URL:', requestURL);

    // GET 요청 보내기
    const response = await axios.get(requestURL);

    // Content-Type 확인
    const contentType = response.headers['content-type'];
    console.log('Content-Type:', contentType);

    // JSON 형식인지 확인
    if (contentType && contentType.includes('application/json')) {
      // JSON 형식의 데이터인 경우
      console.log('Response:', response);
      
      // console.log('Response Data:', response.data);

      // 응답 데이터 확인
      const responseData = response.data;

      console.log('Success_send:', responseData);
      
      // 응답데이터 추출 
      const places = responseData.response.body.items.item;
      const processedData = places.map(place => ({
        address: place.addr1,
        place: place.title,
        image: place.firstimage,
        longitude: place.mapx,
        latitude: place.mapy,
        contentTypeId : place.contenttypeid,
        contentId: place.contentid
        //필요한 데이터 추가
      }));

      console.log('응답데이터',processedData);
      return processedData; // 처리된 데이터를 반환
    } else {
      // JSON 형식이 아닌 경우
      console.log('Received data is not in JSON format.');
      // 처리할 방법을 결정하거나 오류를 처리할 수 있음
      throw new Error('Received data is not in JSON format.');
    }
  } catch (error) {
    console.error('데이터 전송 중 오류:', error);
    throw error;
  }
};

// 토큰 가져오기 함수
const getToken = () => {
  return sessionStorage.getItem('accessToken');
};



//스크랩 요청 보내기
export const sendScrap = async (scrapData) => {
  try {
    const token = getToken();

    const response = await axios.post(`${BASE_URL}/storage`, scrapData, {
      headers: {
        Authorization: `Bearer ${token}` // 헤더에 토큰 추가
      }
    });
    console.log('요청 보내고 받은 데이터',response);
    return response.data; // 서버로부터의 응답 데이터를 반환
  } catch (error) {
    console.error('스크랩 요청 실패:', error);
    throw error; // 에러를 호출자에게 다시 던짐
  }
};

//스크랩 가져오기
export const fetchScrap = async () => {
  try {
    const userToken = getToken();
    if (!userToken) {
      throw new Error('스크랩 데이터를 찾을 수 없습니다');
    }
    const response = await axios.get(`${BASE_URL}/scrap`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });

    const scrapData = response.data.map(location => ({
      id: location.id,  
      place: location.place,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
      contentTypeId : location.contenttypeid,
      contentId: location.contentid
    }));
    

    console.log('가져온 스크랩 데이터:', scrapData); // 스크랩 데이터 콘솔 출력

    return scrapData;
  } catch (error) {
    console.error('스크랩 데이터를 불러오는데 오류가 발생했습니다 :', error);
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

    console.log(`토큰 확인: ${token}`); // 토큰 값 출력

    const response = await axios.delete(`${BASE_URL}/storage/${scrapId}`, {
      headers: {
        Authorization: `Bearer ${token}` // 헤더에 토큰 추가
      }
    });

    console.log('삭제 요청 응답:', response); // 서버 응답 출력
    return response.data; // 서버로부터의 응답 데이터를 반환
  } catch (error) {
    console.error('스크랩 삭제 실패:', error);
    throw error; // 에러를 호출자에게 다시 던짐
  }
};


//상세설명 나오게 하는 코드
const parseXmlString = (xmlString) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  const overviewNode = xmlDoc.querySelector('overview');
  if (overviewNode) {
    return overviewNode.textContent.trim();
  } else {
    return null;
  }
};

export const fetchEx = async (exData) => {
  try {
    const { contentTypeId, contentId } = exData;
    console.log("내가 보낼 것 : ", contentTypeId, contentId)
    const response = await axios.get(`${BASE_URL}/place?contentTypeId=${contentTypeId}&contentId=${contentId}`, {
      
    });
    console.log('응답 받아온 설명 데이터:', response);
    const xmlString = response.data;
    const overview = parseXmlString(xmlString);
    console.log('overview:', overview);

    return overview;
  } catch (error) {
    console.error('설명 데이터를 불러오는데 오류가 발생했습니다 :', error);
    return []; // 오류 발생 시 빈 배열 반환
  }
};

<h1 align="center">사용자 맞춤형 웹서비스, Trip Bridge</h1>

<p align="center">
  <img src="https://github.com/user-attachments/assets/584c70f5-73cc-4bf3-8237-74323ef30a3c" alt="Trip Bridge" />
</p>

- 배포 URL : https://www.tripbridge.co.kr/
- 테스트 ID : test@test.com
- 테스트 PW : 12341234

<br>


## 📜 목차

- [🚀 프로젝트 소개](#-프로젝트-소개)
- [📝 프로젝트 개요](#-프로젝트-개요)
- [👥 팀원 구성 및 역할](#-팀원-구성-및-역할)
- [🛠 기술 스택](#-기술-스택)
- [📌 주요 기능](#-주요-기능)
  - [1. 로그인/회원가입](#1-로그인회원가입)
  - [2. 메인화면](#2-메인화면)
  - [3. 여행지 추천](#3-여행지-추천)
  - [4. 결과 페이지](#4-결과-페이지)
  - [5. 동선 추천](#5-동선-추천)
  - [6. 장소 추가 검색](#6-장소-추가-검색)
  - [7. 챗봇](#7-챗봇)
  - [8. 마이페이지](#8-마이페이지)
  - [9. 주변 장소 추천](#9-주변-장소-추천)
  - [10. 게시판](#10-게시판)
- [📐 서비스 아키텍처](#-서비스-아키텍처)
- [💡주요 기능 구현 방식](#-주요-기능-구현-방식)



<br>

## 프로젝트 소개
**당신만의 여행을 즐길 수 있는, [Trip Bridge]** <br>
같은 장소를 여행 하더라도 사람들은 각각의 목표와 계획에 의해 다른 여행을 합니다. 하지만 여행 계획 정보를 얻고자 검색을 하면 대부분
유명한 관광지에 대한 정보들만 가득합니다. 이에 사용자가 보다 다양한 선택지를 가지고 여행을 할 수 있도록 서비스를 기획하였습니다.

<br>



## 프로젝트 개요
- __프로젝트 명__ : TripBridge
- __기획 및 디자인, 개발__ : 2024.02.12 ~ 2024.05.31 <br>
- __추가 기능 개발 및 리팩토링__: 2024.09.01 ~ 2024.09.20 
- __진행 방식__: 팀/개인 별 코딩 및 UI 구현

<br>

## 팀원 구성 & 역할 분담
### Front-End
- 백주희(팀장) : 프론트 구현(React), UI 디자인, 프론트 배포
- 황서현 : UI 디자인, 프론트 구현(React)

### Back-End
- 박현지 : DB 설계 및 구축, Rest API 개발, 인프라 설계 및 구축
- 윤현수 : DB 설계 및 구축, Rest API 개발, AWS S3 관리




## 기술 스택

| 카테고리       | 기술 스택 |
|----------------|-----------|
| 프론트엔드           | ![REACT](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![JAVASCRIPT](https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![axios](https://img.shields.io/badge/axios-%235A29E4?style=for-the-badge&logo=axios&logoColorblack) ![CSS](https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=CSS&logoColor=white) ![HTML](https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white) |
| 백엔드 | ![OpenAI](https://img.shields.io/badge/openai-412991?style=for-the-badge&logo=openai&logoColor=white) ![java](https://img.shields.io/badge/java-007396?style=for-the-badge&logo=JAVA&logoColor=white) ![springboot](https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white) ![mysql](https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white) |
| 디자인           | ![Figma](https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white) |
| 인프라   | ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white) ![Github Actions](https://img.shields.io/badge/githubactions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white) ![Docker](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)|
| 협업 도구      | ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white) ![Notion](https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white)| 



<br>
<br>

## 주요 기능 

### 1) 로그인/ 회원가입
- TripBridge 사이트에 로그인, 회원가입을 진행할 수 있습니다.
- 회원가입은 단계별로 진행되며 이름, 닉네임, 이메일 주소, 비밀번호, 비밀번호 확인 순서로 진행할 수 있습니다.
- 약관동의에 체크를 하지 않으면 회원가입이 되지 않습니다.

- 가입한 정보로 로그인이 가능합니다.


|회원가입|로그인|
|-------|-------|
|![회원가입](https://github.com/user-attachments/assets/1ed7a6b1-6823-4e24-9971-60d5e9b82dba)|![로그인](https://github.com/user-attachments/assets/aeb92704-7816-4fe8-9c98-31163d46f2a3)|

<br>

 ### 2) 메인화면
 - 메인페이지에서 여행지 추천, 동선 추천, 게시판, 마이페이지로 이동할 수 있습니다

|메인화면|
|---|
|![메인화면](https://github.com/user-attachments/assets/584c70f5-73cc-4bf3-8237-74323ef30a3c)|

<br>

### 3) 여행지 추천
- 사용자 맞춤형 여행지를 찾아드립니다.
- 사용자가 떠나고 싶은 지역, 원하는 관광타입을 선택할 수 있습니다.


|여행지추천|
|---|
|![여행지추천](https://github.com/user-attachments/assets/e29f023f-caab-43ed-88e5-8abf7b2b8a89)|


<br>

### 4) 결과 페이지
- 여행지 추천에서 **결과 보기**를 누르면 결과 페이지로 이동됩니다.
- 사용자가 원하는 지역, 관광타입을 선택하면 그에 맞는 관광지를 추천해드립니다.
- 관광지에 대한 상세 정보가 궁금하다면 이미지를 클릭해 상세 정보를 확인할 수 있습니다. 
- 결과 페이지에서 원하는 관광지가 있다면 스크랩 아이콘을 통해 관광지를 저장할 수 있습니다.
- 스크랩한 관광지가 궁금하다면 **스크랩 목록 확인하러가기**를 클릭하면 보러가실 수 있습니다.


|결과 페이지|
|---|
|![결과 페이지](https://github.com/user-attachments/assets/540daeb8-bf5f-4708-8283-14483ade5103)|

<br>

### 5) 동선 추천
- 결과 페이지에서 **스크랩 목록 확인하러가기** 를 누르면 나오는 페이지 입니다.
- 이 페이지에서는 스크랩한 장소가 저장되어 있습니다.
- **스크랩한 장소**를 클릭하면 지도에 장소가 표시 됩니다. 
- 여러 장소를 선택하고 **동선 추천** 버튼을 누르면 첫번째 선택한 장소 기준으로 최적의 동선을 추천해 드립니다. 
- 동선은 **동선 저장** 버튼을 눌러 기록할 수 있습니다.
- 장소를 삭제하고 싶다면 **x 아이콘**을 누르면 삭제할 수 있습니다.

|동선 추천|
|---|
|![동선 추천](https://github.com/user-attachments/assets/18b9f78f-90e0-4fdc-8554-9fe2af8920f1)|


<br>

### 6) 장소 추가 검색 
- 추천받은 장소말고도 자신이 가고 싶은 장소를 직접 검색하여 나의 스크랩 목록에 저장할 수 있습니다.
- 장소를 검색하고 **스크랩** 버튼을 누르면 스크랩 목록에 바로 반영됩니다.

|장소 추가 검색|
|---|
|![장소 추가 검색](https://github.com/user-attachments/assets/a0b6b9c4-47f5-48d2-b02f-70681c27c04a)|


<br>

### 7) 챗봇
- 챗봇을 이용하여 여러 정보를 얻을 수 있습니다.
- 챗봇에 원하는 질문을 클릭하면 그에 맞는 답변을 얻으실 수 있습니다.
- 예를들어 동선 추천을 받은 후 **동선간의 이동 수단과 예상 비용**을 클릭하면 관련 정보를 안내받을 수 있습니다.

|챗봇|
|---|
|![챗봇](https://github.com/user-attachments/assets/ada4cb9d-9bc7-4ca5-acf0-7d9688dc1241)|


<br>

### 8) 마이페이지
- 마이페이지를 누르면 지금까지 저장한 동선들을 한눈에 확인하실 수 있습니다.
- 내 동선 목록에서 지금까지 저장된 동선 중 하나를 클릭하면 동선의 이름을 바꾸기, 평점 매기기, 메모하기 기능을 이용하여 나만의 동선을 꾸밀 수 있습니다.

|마이페이지|
|---|
|![마이페이지](https://github.com/user-attachments/assets/3a971101-6920-4958-9e3f-e6e9af0ffdb6)|


<br>

### 9) 주변 장소 추천 기능

- 마이페이지의 주변 장소 추천 기능은 스크랩 목록에서 장소를 클릭한 후 **주변 관광지 추천 리스트**를 선택하면 이용할 수 있습니다.  
- 선택한 장소는 검은색 아이콘, 추천된 주변 관광지는 파란색 아이콘으로 지도에 표시됩니다.  
- 추천된 관광지 중 마음에 드는 장소가 있다면, 리스트에 있는 장소중 하나를 클릭하여 파란색 아이콘 위에 표시되는 **스크랩 아이콘**을 눌러 스크랩할 수 있습니다.

|주변장소 추천|
|---|
|![주변장소 추천](https://github.com/user-attachments/assets/505b3f6b-e005-4d12-a532-9aa80ea92ca8)|


<br>

### 10) 게시판
- 게시판에서는 여행 기록을 공유하거나 여행 메이트를 찾을 수 있습니다.  
- 글쓰기, 수정, 삭제 기능을 통해 자유롭게 게시글을 작성할 수 있습니다.  
- 다른 사용자들은 게시글에 댓글을 남겨 소통할 수 있습니다.

|주변장소 추천|
|---|
|![주변장소 추천](https://github.com/user-attachments/assets/11654fc8-a698-4e04-b017-1f9c36844726)|


<br>


## 서비스 아키텍처

<img src="https://github.com/user-attachments/assets/8ca10dc1-ed81-41ca-9f0f-d1ebbeaa0f31" width="40%"/>


<br><br>


## 주요 기능 구현 방식

### 공공 데이터
공공데이터는 정부와 공공기관에서 사업이나 연구 활동 중 생성되는 다양한 데이터를 의미합니다.
본 프로젝트에서는 한국관광공사에서 제공하는 **국문 관광정보 API**를 활용하여, 사용자 맞춤형 관광지 추천 서비스를 구현했습니다.
이 데이터를 통해 사용자가 다양한 관광지를 쉽게 찾을 수 있도록 했습니다.



### Kakao Maps API
Kakao Maps API는 웹과 모바일에서 지도 기반 서비스를 구축할 수 있도록 다양한 기능을 지원합니다.
본 서비스에서는 TSP 알고리즘과 Kakao Maps의 지도 및 마커 기능을 결합하여 최적의 여행 경로를 추천합니다.
Maps API의 내장된 마커를 활용하여 사용자는 지도 위에서 관광지 위치와 명칭을 직관적으로 확인하며 여행 동선을 계획할 수 있습니다.


### OpenAI 서비스
OpenAI API는 자연어 처리 기반의 기계학습 모델에 접근할 수 있는 인터페이스를 제공합니다.
본 시스템에서는 ChatGPT의 GPT-3.5 Turbo 모델을 활용하여, 사용자 요청에 실시간으로 응답하는 대화형 지원 기능을 구현했습니다.
이를 통해 여행 동선 추천이나 스크랩한 장소와 관련해 사용자가 추가 정보를 필요로 할 때 즉시 정보를 제공할 수 있습니다.


<br>

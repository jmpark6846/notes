# 📒Notes
React와 Firebase 로 만든 노트 웹 어플리케이션 :) 

## 특이사항
- `create-react-app`으로 제작. `react-router`, `recompose` 사용
- 노트 작성 후 500ms 지나면 자동 저장. 리엑트 컴포넌트의 `onChange` 이벤트 핸들러와 [lodash.debounce](https://lodash.com/docs/4.17.15#debounce) 사용
- `react-sizes` 활용한 responsive layout. 
- 로그인, 회원가입 등 인증 기능에 Firebase의 authentication api 사용
- database로 firebase의 firestore(nosql) 사용
- UI Framework으로 `evergreen-ui` 사용 
- 리엑트 WYSIWYG 에디터 [Slate](https://www.slatejs.org/) 사용

## 개발 환경
- react 16.8.6
- react-router-dom 5.0.1
- recompose 0.30.0
- slate 0.47.4
- firebase 6.3.3
- evergreen-ui 4.18.1
- lodash 4.17.15
- react-sizes 2.0.0
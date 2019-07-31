import firebase from "firebase/app";
import "firebase/firestore"
import "firebase/auth"

// firebase api 설정 값들은 public값이므로 숨길 필요가 없다. .env 에 시크릿 값을 적어도 빌드 시 노출된다.
firebase.initializeApp({
  apiKey: "AIzaSyD70mOFNDK4VjoQOw9JBItSw0_aME3EeWw",
  authDomain: "notes-d5c0d.firebaseapp.com",
  databaseURL: "https://notes-d5c0d.firebaseio.com",
  projectId: "notes-d5c0d",
  storageBucket: "notes-d5c0d.appspot.com",
  messagingSenderId: "1001740796289",
  appId: "1:1001740796289:web:4c92c4b3621037cc"
});

export default firebase
export const db = firebase.firestore();

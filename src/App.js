import React from "react";
import NotePage from "./Pages/NotePage";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyD70mOFNDK4VjoQOw9JBItSw0_aME3EeWw",
  authDomain: "notes-d5c0d.firebaseapp.com",
  databaseURL: "https://notes-d5c0d.firebaseio.com",
  projectId: "notes-d5c0d",
  storageBucket: "notes-d5c0d.appspot.com",
  messagingSenderId: "1001740796289",
  appId: "1:1001740796289:web:4c92c4b3621037cc"
});

export const db = firebase.firestore();

function App() {
  return <NotePage />;
}

export default App;

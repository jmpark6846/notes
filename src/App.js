import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NotePage from "./Pages/NotePage";
import SignInPage from "./Pages/SignInPage";
import SignUpPage from "./Pages/SignUpPage";
import "./App.css";
import ProtectedRoute from "./Components/ProtectedRoute";
import { auth } from "./db";
import { userContext } from "./Context";

const initialValue = {
  uid: null,
  email: null,
  username: null,
  isLoggedIn: false,
}

  
function App() {
  const [user, setUser] = useState(initialValue);
  auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      if (user.uid !== firebaseUser.uid) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: firebaseUser.displayName,
          isLoggedIn: true,
        });  
      }
    } else {
      setUser(null);
    }
  });

  return (
    <userContext.Provider value={ user }>
      <Router>
        <ProtectedRoute exact path="/" component={NotePage} />
        <Route path="/signin" component={SignInPage} />
        <Route path="/signup" component={SignUpPage} />
      </Router>
    </userContext.Provider>
  );
}


export default App;

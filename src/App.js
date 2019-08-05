import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NotePage from "./Pages/NotePage";
import SignInPage from "./Pages/SignInPage";
import SignUpPage from "./Pages/SignUpPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import { auth } from "./db";
import { userContext, initialUser } from "./Context";
import "./App.css";

function App() {
  const [user, setUser] = useState(initialUser);
  const updateUser = (user) => setUser({ ...user })

  useEffect(() => {
    auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        if (!user.isLoggedIn) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: firebaseUser.displayName,
            isLoggedIn: true,
            isLoading: false
          });
        }
      } else {
        if (user.isLoading) {
          setUser({
            ...initialUser,
            isLoading: false
          });
        }
      }
    });
    return () => { 
      auth.onAuthStateChanged(() => { })  
    }
  }, [user])
  
  return (
    <userContext.Provider value={{ ...user, updateUser }}>
      <Router>
        <ProtectedRoute exact path="/" component={NotePage} />
        <Route path="/signin" component={SignInPage} />
        <Route path="/signup" component={SignUpPage} />
      </Router>
    </userContext.Provider>
  );
}

export default App;

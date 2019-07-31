import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NotePage from "./Pages/NotePage";
import SignInPage from "./Pages/SignInPage";
import SignUpPage from "./Pages/SignUpPage";
import "./App.css";
import ProtectedRoute from "./Components/ProtectedRoute";
import { auth } from "./db";
import { userContext, initialUser } from "./Context";

function App() {
  const [user, setUser] = useState(initialUser);
  auth.onAuthStateChanged(firebaseUser => {
    if (!user.isLoggedIn) {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: firebaseUser.displayName,
          isLoggedIn: true,
          isLoading: false
        });
      } else {
        setUser(initialUser);
      }
    }
  });

  return (
    <userContext.Provider value={user}>
      <Router>
        <ProtectedRoute exact path="/" component={NotePage} />
        <Route path="/signin" component={SignInPage} />
        <Route path="/signup" component={SignUpPage} />
      </Router>
    </userContext.Provider>
  );
}

export default App;

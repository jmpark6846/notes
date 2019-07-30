import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NotePage from "./Pages/NotePage";
import SignInPage from "./Pages/SignInPage";
import SignUpPage from "./Pages/SignUpPage";
import "./App.css";

function App() {
  return <Router>
    <Route exact path="/" component={NotePage}/>
    <Route path="/signup" component={SignUpPage} />
    <Route path="/signin" component={SignInPage} />
    </Router>
}

export default App;

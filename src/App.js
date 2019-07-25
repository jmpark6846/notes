import React from "react";
import "./App.css";
import Header from "./Components/Header";
import NoteList from "./Components/NoteList";

function App() {
  return (
    <div className="App">
      <Header />
      <NoteList />
    </div>
  );
}

export default App;

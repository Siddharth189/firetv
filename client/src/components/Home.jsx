import React from "react";
import Header from "./Header";
import Search from "./custom ai search/Search";
import Enigma from "./enigma/Enigma";

function Home() {
  return (
    <div className="home-page">
      <Header />
      <Search />

      {/* <AudioRecorder /> */}

      <Enigma />
    </div>
  );
}

export default Home;

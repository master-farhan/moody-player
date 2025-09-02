import React, { useState } from "react";
import FaceDetection from "./components/FaceDetection";
import MoodSongs from "./components/MoodSongs";

const App = () => {
  const [Songs, setSongs] = useState([]);
  console.log(Songs)
  
  return (
    <div className="min-h-screen px-[10%] py-10 bg-[#000000] text-white">
      <FaceDetection Songs={Songs} setSongs={setSongs} />
      <MoodSongs Songs={Songs} setSongs={setSongs} />
    </div>
  );
};

export default App;

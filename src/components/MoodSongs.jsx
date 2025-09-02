import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react"; // icon library

const MoodSongs = ({ Songs }) => {

    const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="py-10">
      <h2 className="text-2xl font-semibold mb-3">Recommended Songs</h2>

      {Songs.map((song, index) => (
        <div
          key={index}
          className="flex justify-between items-center rounded-xl mb-2"
        >
          <div className="">
            <h3 className="text-lg font-bold">{song.title}</h3>
            <p className="text-sm">By {song.artist}</p>
          </div>
          <audio ref={audioRef} src={song.audio} className="hidden" />
          <button onClick={togglePlay} className="p-2 bg-primary rounded-full">
            {isPlaying ? <Pause /> : <Play />}
          </button>
        </div>
      ))}
    </div>
  );
};

export default MoodSongs;

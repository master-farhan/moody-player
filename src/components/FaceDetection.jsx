import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

function FaceDetection({ Songs, setSongs }) {
  const videoRef = useRef(null);
  const [expression, setExpression] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      startVideo();
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Camera error:", err));
    };

    loadModels();
  }, []);

  const detectExpression = async () => {
    if (!videoRef.current) return;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detection?.expressions) {
      const expressions = detection.expressions;
      const bestMatch = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      );

      setExpression(bestMatch);

      axios
        .get(
          `https://moody-player-backend-2-73os.onrender.com/songs?mood=${bestMatch}`
        )
        .then((response) => {
          setSongs(response.data.songs);
        })
        .catch((err) => console.error("Error fetching songs:", err));
    } else {
      setExpression("No face detected 😥");
    }
  };

  return (
    <div className="flex md:flex-row flex-col gap-5 items-center">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="h-50 aspect-auto object-cover rounded-2xl"
      />
      <button
        onClick={detectExpression}
        className="py-2 px-5 bg-[#333] rounded-xl cursor-pointer hover:bg-[#444] active:scale-95 transition-all duration-150"
      >
        {loading ? "Fetching songs..." : "Detect Expression"}
      </button>
      <h2>
        {expression
          ? `Detected Expression: ${expression}`
          : "Click the button to detect face expression"}
      </h2>
    </div>
  );
}

export default FaceDetection;

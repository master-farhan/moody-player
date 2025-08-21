import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

function FaceDetection() {
  const videoRef = useRef(null);
  const [expression, setExpression] = useState("");

  useEffect(() => {
    // Load models
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

      startVideo();
    };

    // Start webcam
    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error("Camera error:", err));
    };

    loadModels();
  }, []);

  // Detect expression when button is clicked
  const detectExpression = async () => {
    if (videoRef.current) {
      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions();

      if (detection && detection.expressions) {
        const expressions = detection.expressions;
        const bestMatch = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );
        setExpression(bestMatch);
      } else {
        setExpression("No face detected 😅");
      }
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="400"
        height="300"
        style={{ border: "2px solid black", marginBottom: "10px" }}
      />
      <br />
      <button
        onClick={detectExpression}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Detect Expression
      </button>
      <h2 style={{ marginTop: "15px" }}>
        {expression
          ? `Detected Expression: ${expression}`
          : "Click the button to detect face expression"}
      </h2>
    </div>
  );
}

export default FaceDetection;

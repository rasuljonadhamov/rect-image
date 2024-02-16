import { useRef, useState } from "react";

const App = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  let mediaStream;

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStream = stream;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      const tracks = mediaStream.getTracks();
      tracks.forEach((track) => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataURL = canvas.toDataURL("image/png");
      setPhoto(dataURL);
      stopCamera();
    }
  };

  return (
    <div className="container">
      <div>
        <button
          style={{
            border: "none",
            padding: "15px 30px",
            cursor: "pointer",
            backgroundColor: "green",
            color: "white",
            marginRight: "20px",
            borderRadius: "7px",
          }}
          onClick={startCamera}
        >
          Start Camera
        </button>
        <button
          style={{
            border: "none",
            padding: "15px 30px",
            cursor: "pointer",
            backgroundColor: "red",
            color: "white",
            borderRadius: "7px",
          }}
          onClick={takePhoto}
        >
          Take Photo
        </button>
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: "300px",
          gap: 40,
          marginTop: 20,
        }}
      >
        {photo && <img src={photo} alt="Captured" />}

        <video
          ref={videoRef}
          autoPlay
          muted
          style={{ width: "100%", maxWidth: "300px" }}
        />
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default App;

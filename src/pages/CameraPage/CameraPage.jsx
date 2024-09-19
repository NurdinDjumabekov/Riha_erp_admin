import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";

/////// style
import "./style.scss";

////// icons
import restart from "../../assets/icons/arrow-repeat.svg";

const CameraPage = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [cameraFront, setCameraFront] = useState(true);

  // Захват фото
  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc); // В строке base64
  }, [webcamRef]);

  // Начать запись видео
  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing]);

  // Остановить запись видео
  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recorded-video.webm";
      a.click();
      URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  // Переключение камеры
  const toggleCamera = () => {
    setCameraFront((prev) => !prev);
  };

  return (
    <div className="cameraPage">
      <Webcam
        audio={true}
        ref={webcamRef}
        screenshotFormat="image/png"
        videoConstraints={{
          facingMode: cameraFront ? "user" : { exact: "environment" },
        }}
        mirrored={cameraFront}
      />
      <div className="photoSettings">
        <button onClick={capturePhoto}>Capture Photo</button>

        {capturing ? (
          <button onClick={handleStopCaptureClick}>Stop Recording</button>
        ) : (
          <button onClick={handleStartCaptureClick}>Start Recording</button>
        )}

        {/* {recordedChunks.length > 0 && (
          <button onClick={handleDownload}>Download Video</button>
        )} */}

        <button onClick={toggleCamera} className="restart">
          <img src={restart} alt="()" />
        </button>
      </div>
    </div>
  );
};

export default CameraPage;

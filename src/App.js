// import logo from './logo.svg';
import './App.css';
import Webcam from "react-webcam";
import { useCallback, useEffect, useRef, useState } from 'react';

function App() {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [videoBlob, setVideoBlob] = useState(null);

  // useEffect(() => {
  //   mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
  //     mimeType: "video/webm"
  //   });
  //   mediaRecorderRef.current.addEventListener(
  //     "dataavailable",
  //     handleDataAvailable
  //   );
  //   mediaRecorderRef.current.addEventListener(
  //     "stop",
  //     handleOnStop
  //   );
  // }, []);

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    setVideoBlob(null);
    setRecordedChunks([]);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    // mediaRecorderRef.current.addEventListener(
    //   "stop",
    //   handleOnStop
    // );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
        console.log("chunk");
        console.log(data);
        // const blob = new Blob(recordedChunks, {
        //   type: "video/webm"
        // });
        const url = URL.createObjectURL(data);
        setVideoBlob(url);
        console.log(url);
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
    
  }, [mediaRecorderRef, webcamRef, setCapturing]);


  // const handleOnStop = useCallback(() => {
  //   console.log("data available after MediaRecorder.stop() called.");
  //   console.log(recordedChunks);
  //   // if (recordedChunks.length) {
  //   //   const blob = new Blob(recordedChunks, {
  //   //     type: "video/webm"
  //   //   });
  //   //   const url = URL.createObjectURL(blob);
  //   //   setVideoBlob(url);
  //   //   console.log(url);
  //   // }
  // }, [recordedChunks, setVideoBlob]);

  // const handleConvertVideo = (() => {
  //   console.log("convert video");
  //   console.log(recordedChunks);
  //   if (recordedChunks.length) {
  //     const blob = new Blob(recordedChunks, {
  //       type: "video/webm"
  //     });
  //     const url = URL.createObjectURL(blob);
  //     setVideoBlob(url);
  //     console.log(url);
  //   }
  // });

  // const convertVideo = (() => {
  //   console.log("convert video");
  //   console.log(recordedChunks);
  //   if (recordedChunks.length) {
  //     const blob = new Blob(recordedChunks, {
  //       type: "video/webm"
  //     });
  //     const url = URL.createObjectURL(blob);
  //     return url;
  //   }
  // });

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  const video = (videoBlob ? 
    (
      <video controls autoPlay>
          <source src={videoBlob} type="video/webm"/>
        </video>
    ) : (<div></div>)
  );

  return (
    <div className="App">
      <Webcam audio={false} ref={webcamRef} mirrored={true} />
      {capturing ? (
        <button onClick={handleStopCaptureClick}>Stop Capture</button>
      ) : (
        <button onClick={handleStartCaptureClick}>Start Capture</button>
      )}
      {/* <button onClick={handleConvertVideo}>Convert Video</button> */}
      {/* {videoBlob && (
        <video controls>
          <source src={videoBlob} type="video/webm"/>
        </video>
      )} */}
      {video}

{/* {recordedChunks.length > 0 && (
        <button onClick={handleDownload}>Download</button>
      )} */}
    </div>
  );
}

export default App;

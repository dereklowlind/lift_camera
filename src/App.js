import './App.css';
import Webcam from "react-webcam";
import { useCallback, useRef, useState } from 'react';
import { Button } from '@material-ui/core';

function App() {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  // const [recordedChunks, setRecordedChunks] = useState([]);
  const [videoBlob, setVideoBlob] = useState(null);

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    setVideoBlob(null);
    // setRecordedChunks([]);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream);
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        // setRecordedChunks((prev) => prev.concat(data));
        console.log("chunk");
        console.log(data);
        const url = URL.createObjectURL(data);
        setVideoBlob(url);
        console.log(url);
      }
    }, []
    [setVideoBlob]
  );

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
    
  }, [mediaRecorderRef, webcamRef, setCapturing]);


  // const handleDownload = useCallback(() => {
  //   if (recordedChunks.length) {
  //     const blob = new Blob(recordedChunks, {
  //       type: "video/webm"
  //     });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     document.body.appendChild(a);
  //     a.style = "display: none";
  //     a.href = url;
  //     a.download = "react-webcam-stream-capture.webm";
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //     setRecordedChunks([]);
  //   }
  // }, [recordedChunks]);

  const video = (videoBlob ? 
    (
      <video controls autoPlay muted playsInline width={'100%'} height={'100%'}>
          <source src={videoBlob}/>
        </video>
    ) : (<div></div>)
  );

  return (
    <div className="App">
      <Webcam width={'100%'} height={'100%'} audio={false} ref={webcamRef} mirrored={true} />
      {capturing ? (
        <Button variant="contained" onClick={handleStopCaptureClick}>
          stop
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={handleStartCaptureClick}>
          start
        </Button>
        
      )}
      {video}
    </div>
  );
}

export default App;

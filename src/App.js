import './App.css';
import Webcam from "react-webcam";
import { useCallback, useRef, useState } from 'react';
import { Button } from '@material-ui/core';
// import { TimePicker } from '@material-ui/lab';
import Countdown, { zeroPad } from 'react-countdown';
import useSound from 'use-sound';
import timerEndBeep from './mixkit-alert-bells-echo-765.wav';

function App() {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const countDownRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  // const [recordedChunks, setRecordedChunks] = useState([]);
  const [videoBlob, setVideoBlob] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  // const [ countDownLegth, setCountDownLength ] = useState(0)

  const [playTimerEndBeep] = useSound(timerEndBeep);



  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    setVideoBlob(null);
    // setRecordedChunks([]);
    const resetKeyCand = resetKey ? 0 : 1; // toggle between 0 and 1
    setResetKey(resetKeyCand);
    countDownRef.current.stop();
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
    
    countDownRef.current.start();
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



  // Renderer callback with condition
  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      // Render a complete state
      return <span className="countDown">Done!</span>;
    } else {
      // Render a countdown
      return (
        <span className="countDown">
          {zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
      );
    }
  };

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
        <button className="startStopButton stopButton" onClick={handleStopCaptureClick}>
          stop
        </button>
      ) : (
        <button className="startStopButton startButton" color="primary" onClick={handleStartCaptureClick}>
          start
        </button>
        
      )}
        <Countdown
          ref={countDownRef}
          autoStart={false}
          date={Date.now() + 120000}
          renderer={renderer}
          key={resetKey}
          onComplete={playTimerEndBeep}
          
        />
        {/* <button onClick={playTimerEndBeep}>beep</button> */}
        {/* <TimePicker 
          ampmInClock
          views={['minutes', 'seconds']}
          inputFormat="mm:ss"
          mask="__:__"
          label="Minutes and seconds"
          value={countDownLegth}
          onChange={(newValue) => {
            setCountDownLength(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
        {countDownLegth} */}
      {video}
    </div>
  );
}

export default App;

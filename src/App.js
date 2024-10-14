import './App.css';
import { useState, useEffect } from 'react';

function TopBar({currentHHMMSS, handleClick}) {
  return (
    <div id="top-bar">
      <div id="settings-button" className="clickable" onClick={handleClick}>
        <img src="gear.svg" alt="settings" style={{"width": "1.5rem"}}/>
      </div>
      <div id="current-time">{currentHHMMSS}</div>
    </div>
  )
}


function Screen({currMinutes, targetHHMM}) {
  /* 
    Case 1: 30m --> 11:34
    Case 2: 1h 30m --> 12:34
  */
  let HH = Math.floor(currMinutes / 60);
  let MM = currMinutes % 60;
  
  return (
    <div id="screen">
      <span>{HH === 0 ? '' : `${HH}h`}</span>
      <span>{MM}m </span>
      <span>(</span>
      <span id="arrow-sign">
        <img src="arrow.svg" alt="→" style={{"width": "2rem"}}/>
      </span>
      <span>{targetHHMM}</span>
      )
    </div>
  )
}


function ButtonSet({onButtonClick, onReset, onStart}) {  
  return (
    <div id="button-set">
      <div id="button-1" className="clickable" onClick={onButtonClick(1)}>+1m</div>
      <div id="button-2" className="clickable" onClick={onButtonClick(5)}>+5m</div>
      <div id="button-3" className="clickable" onClick={onButtonClick(10)}>+10m</div>
      <div id="button-4" className="clickable" onClick={onButtonClick(15)}>+15m</div>
      <div id="button-5" className="clickable" onClick={onButtonClick(30)}>+30m</div>
      <div id="button-6" className="clickable" onClick={onButtonClick(60)}>+1h</div>
      <div id="reset-button" className="clickable" onClick={onReset}>
        <img src="reset.svg" alt="Reset" style={{"width": "1.5rem"}}/>
      </div>
      <div id="enter-button" className="clickable" onClick={onStart}>Start</div>
    </div>
  )
}


function Counter({targetTimestamp, onEndCounting}) {

  let [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    setSecondsLeft(Math.floor((targetTimestamp - new Date().getTime()) / 1000));
    let interval = setInterval(() => {
      setSecondsLeft(Math.floor((targetTimestamp - new Date().getTime()) / 1000));
    }, 1_000)
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  useEffect(() => {
    let interval = setInterval(() => {
      if (new Date().getTime() >= targetTimestamp) {
        onEndCounting();
        return;
      }
    }, 1_000);

    return () => clearInterval(interval);
  });


  return (
    <div id="counter">
      <span style={{fontSize: "1.3rem"}}>A timer has been set. </span><br/>
      <span><span style={{fontSize: "2rem"}}>{secondsLeft}</span> seconds left.</span><br/>
      Note: This is a UI demo for prototyping purpose, do not use it as a real timer.
    </div>
  )
}


function getCurrentHHMMSS() {   // -> String("12:34:56")
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function App() {

  let [minutesLeft, setMinutesLeft] = useState(0);    // TODO: change to "seconds left", so that when the timer is paused, this is incremented every second
  let [targetHHMM, setTargetHHMM] = useState(null);
  let [currentHHMMSS, setCurrentHHMMSS] = useState(getCurrentHHMMSS());
  let [isCounting, setIsCounting] = useState(false);
  let [targetTimestamp, setTargetTimestamp] = useState(null);

  useEffect(() => {
    setCurrentHHMMSS(getCurrentHHMMSS());
    let interval = setInterval(() => {
      setCurrentHHMMSS(getCurrentHHMMSS());
    }, 1_000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {   // keep `targetHHMM` in sync with `currMinutes
    if (isCounting) {
      return;
    }
    const targetTimestamp = minutesLeft * 60_000 + new Date().getTime();
    const targetTime = new Date(targetTimestamp);
    setTargetTimestamp(targetTimestamp);
    const hrs = String(targetTime.getHours()).padStart(2, '0');
    const mins = String(targetTime.getMinutes()).padStart(2, '0');
    setTargetHHMM(`${hrs}:${mins}`);
  }, [minutesLeft, currentHHMMSS, isCounting]);


  const handleButtonClick = (minutesAdd) => () => {
    const maxMinutes = 24 * 60;  /* max of 24h */
    const clipped = 
        (minutesLeft + minutesAdd > maxMinutes) 
        ? (maxMinutes) 
        : (minutesLeft + minutesAdd);
    setMinutesLeft(clipped);
  }

  const handleReset = () => {
    setMinutesLeft(0);
  }

  const handleStart = () => {
    if (minutesLeft === 0) {
      return;
    }
    setIsCounting(true);
    setMinutesLeft(0);
  }

  const handleSettingsButton = () => {
    // todo: currently: refresh the page
    // it should be opening a setting page
    window.location.reload();
  }

  return (
    <div id="App">
      <div id="watch-face">
        <TopBar currentHHMMSS={currentHHMMSS} handleClick={handleSettingsButton}/>
        {isCounting 
          ? <>
              <Counter targetTimestamp={targetTimestamp} onEndCounting={() => setIsCounting(false)}/>
            </>
          : <>
              <Screen currMinutes={minutesLeft} targetHHMM={targetHHMM}/>
              <ButtonSet onButtonClick={handleButtonClick} onReset={handleReset} onStart={handleStart}/>
            </>
        }
      </div>

      <div id="spacer" style={{height: "10vh", width: "100%"}}></div>

    </div>
  );
}


export default App;

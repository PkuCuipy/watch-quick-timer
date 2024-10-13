import './App.css';
import { useState, useEffect } from 'react';

function TopBar() {

  function getCurrentHHMMSS() {   // -> String("12:34:56")
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  let [currentHHMMSS, setCurrentHHMMSS] = useState(getCurrentHHMMSS());


  useEffect(() => {
    setCurrentHHMMSS(getCurrentHHMMSS());
    let interval = setInterval(() => {
      setCurrentHHMMSS(getCurrentHHMMSS());
      console.log(123);
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <div id="top-bar">
      <div id="settings-button" className="clickable">
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


function ButtonSet({onButtonClick, onReset}) {
  return (
    <div id="button-set">
      <div id="button-1" className="clickable" onClick={onButtonClick(1)}>+1m</div>
      <div id="button-2" className="clickable" onClick={onButtonClick(5)}>+5m</div>
      <div id="button-3" className="clickable" onClick={onButtonClick(10)}>+10m</div>
      <div id="button-4" className="clickable" onClick={onButtonClick(15)}>+15m</div>
      <div id="button-5" className="clickable" onClick={onButtonClick(30)}>+30m</div>
      <div id="button-6" className="clickable" onClick={onButtonClick(60)}>+1h</div>
      <div id="reset-button" className="clickable" onClick={onReset}>
        <img src="reset.svg" style={{"width": "1.5rem"}}/>
      </div>
      <div id="enter-button" className="clickable">Start</div>
    </div>
  )
}


function App() {

  let [currMinutes, setCurrMinutes] = useState(0);
  let [targetHHMM, setTargetHHMM] = useState(null);

  useEffect(() => {   // keep `targetHHMM` in sync with `currMinutes
    const targetTimestamp = currMinutes * 60_000 + new Date().getTime();
    const targetTime = new Date(targetTimestamp);
    const hrs = String(targetTime.getHours()).padStart(2, '0');
    const mins = String(targetTime.getMinutes()).padStart(2, '0');
    setTargetHHMM(`${hrs}:${mins}`);
  }, [currMinutes]);

  const handleButtonClick = (minutesAdd) => () => {
    setCurrMinutes(currMinutes + minutesAdd);
  }

  const handleReset = () => {
    setCurrMinutes(0);
  }

  return (
    <div id="App">
      <div id="watch-face">
        <TopBar/>
        <Screen currMinutes={currMinutes} targetHHMM={targetHHMM}/>
        <ButtonSet onButtonClick={handleButtonClick} onReset={handleReset}/>
      </div>
    </div>
  );
}


export default App;

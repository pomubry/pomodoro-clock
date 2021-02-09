import { useRef, useEffect, useState } from 'react';
import Session from './components/Session';

// Media
import beep from './audio/beep.ogg';
// Icons
import {
  AiFillGithub,
  AiOutlinePauseCircle,
  AiOutlinePlayCircle,
  AiOutlineUndo,
} from 'react-icons/ai';

// Counter represents the minutes.
// 'totalSeconds' is the converted value of 'counter' to seconds.
const initialArr = [
  { name: 'Session', counter: 25, totalSeconds: 1500, countStart: null },
  { name: 'Break', counter: 5, totalSeconds: 300, countStart: null },
];

const App = () => {
  // Timer will begin with the 'Session', so defaultIndex will be 0 to start with initialArr[0] or arr[0].
  // As a reminder, 0 represents 'Session' while 1 represents 'Break'.
  const [arr, setArr] = useState(initialArr);
  const [defaultIndex, setDefaultIndex] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const audioRef = useRef();

  // Prevents 'useEffect' from line 147 from running on first render.
  const firstCycle = useRef(true);

  // Reset clock timers.
  const handleReset = () => {
    clearInterval(arr[defaultIndex].countStart);

    let resetArr = arr.map((session) => ({
      ...session,
      totalSeconds: session.counter * 60,
      countStart: null,
    }));
    setArr(resetArr);
    setDefaultIndex(0);
    setDisabled(false);

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  // Increase/decrease the session/break time counter.
  const handleClick = (e) => {
    const { value, name } = e.target;
    let newArr = [...arr];
    const index = newArr.findIndex((obj) => obj.name === name);
    const { counter } = newArr[index];

    // Check if the time counter is already at max(60) or min(0) limit value.
    const limitCheck =
      (counter === 1 && parseInt(value) === -1) ||
      (counter === 60 && parseInt(value) === 1);

    // If the time counter is at the limit, prevent icreasing/decreasing time counter.
    // Else, continue increasing/decrease time coutner by 1.
    if (!limitCheck) {
      newArr[index] = {
        ...newArr[index],
        counter: counter + parseInt(value),
        totalSeconds: 60 * (counter + parseInt(value)),
      };

      setArr(newArr);
    }
  };

  // This will run every 1 second while the timer is active.
  // It will decrease the current session's 'totalSeconds' by 1 second.
  const countDown = () => {
    setArr((prevstate) => {
      let newArr = [...prevstate];
      const { totalSeconds } = newArr[defaultIndex];
      newArr[defaultIndex] = {
        ...newArr[defaultIndex],
        totalSeconds: totalSeconds - 1,
      };

      return newArr;
    });
  };

  // Start or pause the timer.
  const handleStart = (e) => {
    const { totalSeconds, countStart } = arr[defaultIndex];
    let newArr = [...arr];

    // Check if the counter hasn't started yet.
    // If it hasn't, start the timer.
    // setInterval will return a value which will be used to pause the timer. It will run the 'countDown' function above.
    if (totalSeconds > 0 && countStart === null) {
      newArr[defaultIndex] = {
        ...newArr[defaultIndex],
        countStart: setInterval(countDown, 1000),
      };
      setArr(newArr);
      setDisabled(true);
    }

    // If the counter is already running, pause it.
    else {
      clearInterval(countStart);
      newArr[defaultIndex] = {
        ...newArr[defaultIndex],
        countStart: null,
      };
      setArr(newArr);
      setDisabled(false);
    }
  };

  // Check whether the timer already reached 0.
  // This check will happen everytime 'totalSeconds' change.
  useEffect(() => {
    const { totalSeconds, countStart } = arr[defaultIndex];
    let newArr = [...arr];

    // If the timer reached 0, stop the timer and reset 'countStart' to its default value which is null.
    if (totalSeconds === 0 && countStart !== null) {
      clearInterval(countStart);
      newArr[defaultIndex] = {
        ...newArr[defaultIndex],
        countStart: null,
      };

      // Default index will switch to either 0 or 1 depending on its current value.
      // As a reminder, 0 represents 'Session' while 1 represents 'Break'.
      let otherIndex = defaultIndex === 0 ? 1 : 0;

      // Check the next timer's 'totalSeconds' if it is already at 0 or not.
      // If it is, reset it to its default value so the program could start counting down again.
      // If its not, don't change anything.
      let otherTotalSeconds =
        newArr[otherIndex].totalSeconds > 0
          ? newArr[otherIndex].totalSeconds
          : 60 * newArr[otherIndex].counter;

      newArr[otherIndex] = {
        ...newArr[otherIndex],
        totalSeconds: otherTotalSeconds,
      };

      // Set all the changes to state 1 second later after the 'totalSeconds' reached 0.
      setTimeout(() => {
        setArr(newArr);
        setDefaultIndex(otherIndex);
        firstCycle.current = false;
        audioRef.current.play();
      }, 1000);
    }
  }, [arr[defaultIndex].totalSeconds]);

  // A change in the 'defaultIndex' signifies the start of the next counter (to 'Session' or 'Break' depending on the last one).
  useEffect(() => {
    if (!firstCycle.current) {
      handleStart();
    }
  }, [defaultIndex]);

  // Changing the 'totalSeconds' to 'mm:ss' time format.
  let minutes = Math.floor(arr[defaultIndex].totalSeconds / 60);
  let minutesFormat = minutes < 10 ? `0${minutes}` : minutes;
  let seconds = arr[defaultIndex].totalSeconds % 60;
  let secondsFormat = seconds < 10 ? `0${seconds}` : seconds;

  // fontColor for the timer will change to red when its less than 60.
  let warning =
    minutes === 0
      ? { color: '#f44336', marginBottom: '10px', letterSpacing: '7px' }
      : { marginBottom: '10px', letterSpacing: '7px' };

  return (
    <div className="App">
      {/* Hidden audio input for when the tiemr reached 0. */}
      <audio id="beep" ref={audioRef} preload="auto" src={beep}></audio>

      <h1>Pomodoro Clock</h1>
      <div className="display">
        {/* Controls for 'Session' and 'Break' */}
        <Session
          state={{ arr, defaultIndex, disabled }}
          handleClick={handleClick}
        />

        {/* Display for the current session (either 'Session' or 'Break') */}
        <div className="currentSession">
          <h1 id="timer-label">{arr[defaultIndex].name} Time</h1>
          <h2 id="time-left" style={warning}>
            {minutesFormat}:{secondsFormat}
          </h2>
          <div className="main-control">
            <button id="start_stop" onClick={handleStart}>
              {arr[defaultIndex].countStart ? (
                <>
                  <AiOutlinePauseCircle /> <p>Pause</p>
                </>
              ) : (
                <>
                  <AiOutlinePlayCircle /> <p>Start</p>
                </>
              )}
            </button>
            <button id="reset" onClick={handleReset}>
              <AiOutlineUndo /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Profile Link */}
      <div className="credits">
        <p>Designed and Coded By</p>
        <a
          href="https://github.com/pomubry"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AiFillGithub />
          Bryan Taduran
        </a>
      </div>
    </div>
  );
};

export default App;

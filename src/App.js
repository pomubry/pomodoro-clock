import React, { Component } from 'react';
import Session from './components/Session';
import github from './githubIcon.svg';

class App extends Component {
  state = {
    arr: [
      { name: 'Session', counter: 25, totalSeconds: 1500, countStart: null },
      { name: 'Break', counter: 5, totalSeconds: 300, countStart: null },
    ],
    defaultIndex: 0,
    disabled: false,
  };

  audioRef = React.createRef();

  handleReset = (e) => {
    const { arr, defaultIndex } = this.state;
    clearInterval(arr[defaultIndex].countStart);
    this.setState(
      {
        arr: [
          {
            name: 'Session',
            counter: 25,
            totalSeconds: 1500,
            countStart: null,
          },
          { name: 'Break', counter: 5, totalSeconds: 300, countStart: null },
        ],
        defaultIndex: 0,
        disabled: false,
      },
      this.audioRef.current.load()
    );
  };

  handleClick = (e) => {
    const { value, name } = e.target;
    let newArr = [...this.state.arr];
    const index = newArr.findIndex((obj) => obj.name === name);
    const { counter } = newArr[index];
    const limitCheck =
      (counter === 1 && parseInt(value) === -1) ||
      (counter === 60 && parseInt(value) === 1);

    if (!limitCheck) {
      newArr[index] = {
        ...newArr[index],
        counter: counter + parseInt(value),
        totalSeconds: 60 * (counter + parseInt(value)),
      };
    }
    this.setState({ arr: newArr });
  };

  handleStart = (e) => {
    const { arr, defaultIndex } = this.state;
    const { totalSeconds, countStart } = arr[defaultIndex];
    let newArr = [...arr];
    if (totalSeconds > 0 && countStart === null) {
      newArr[defaultIndex] = {
        ...newArr[defaultIndex],
        countStart: setInterval(this.countDown, 1000),
      };
      this.setState({
        arr: newArr,
        disabled: true,
      });
    } else {
      clearInterval(countStart);
      newArr[defaultIndex] = {
        ...newArr[defaultIndex],
        countStart: null,
      };
      this.setState({
        arr: newArr,
        disabled: false,
      });
    }
  };

  countDown = () => {
    const { arr, defaultIndex } = this.state;
    let newArr = [...arr];
    const { totalSeconds } = newArr[defaultIndex];
    newArr[defaultIndex] = {
      ...newArr[defaultIndex],
      totalSeconds: totalSeconds - 1,
    };
    this.setState({ arr: newArr });
  };

  componentDidUpdate() {
    const { arr, defaultIndex } = this.state;
    const { totalSeconds, countStart } = arr[defaultIndex];
    let newArr = [...arr];
    if (totalSeconds === 0 && countStart !== null) {
      clearInterval(countStart);
      newArr[defaultIndex] = {
        ...newArr[defaultIndex],
        countStart: null,
      };

      let otherIndex = defaultIndex === 0 ? 1 : 0;
      let otherTotalSeconds =
        newArr[otherIndex].totalSeconds > 0
          ? newArr[otherIndex].totalSeconds
          : 60 * newArr[otherIndex].counter;

      newArr[otherIndex] = {
        ...newArr[otherIndex],
        totalSeconds: otherTotalSeconds,
      };

      setTimeout(() => {
        this.setState(
          {
            arr: newArr,
            defaultIndex: otherIndex,
          },
          () => {
            this.handleStart();
            this.audioRef.current.play();
          }
        );
      }, 1000);
    }
  }

  render() {
    const { arr, defaultIndex } = this.state;
    const minutes = Math.floor(arr[defaultIndex].totalSeconds / 60);
    const minutesFormat = minutes < 10 ? `0${minutes}` : minutes;
    const seconds = arr[defaultIndex].totalSeconds % 60;
    const secondsFormat = seconds < 10 ? `0${seconds}` : seconds;
    const warning =
      minutes === 0
        ? { color: '#f44336', marginBottom: '10px', letterSpacing: '7px' }
        : { marginBottom: '10px', letterSpacing: '7px' };
    return (
      <div className="App">
        <audio
          id="beep"
          ref={this.audioRef}
          preload="auto"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        ></audio>
        <h1>Pomodoro Clock</h1>
        <div className="display">
          <Session state={this.state} handleClick={this.handleClick} />
          <div className="currentSession">
            <h1 id="timer-label">{arr[defaultIndex].name}</h1>
            <h2 id="time-left" style={warning}>
              {minutesFormat}:{secondsFormat}
            </h2>
            <button id="start_stop" onClick={this.handleStart}>
              <i class="fas fa-play-circle"></i> Start
            </button>
            <button id="reset" onClick={this.handleReset}>
              <i class="fas fa-undo"></i> Reset
            </button>
          </div>
        </div>
        <div className="credits">
          <p>Designed and Coded By</p>
          <a
            href="https://github.com/pomubry"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={github} alt="github icon" />
            Bryan Taduran
          </a>
        </div>
      </div>
    );
  }
}

export default App;

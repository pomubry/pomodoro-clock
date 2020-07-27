import React from 'react';

function Session({ state, handleClick }) {
  const { arr, disabled } = state;
  const sessions = arr.map((obj) => {
    const idLabel = obj.name === 'Break' ? 'break-label' : 'session-label';
    const idDecrement =
      obj.name === 'Break' ? 'break-decrement' : 'session-decrement';
    const idIncrement =
      obj.name === 'Break' ? 'break-increment' : 'session-increment';
    const idLength = obj.name === 'Break' ? 'break-length' : 'session-length';
    return (
      <div className="singleSession" key={obj.name}>
        <h1 id={idLabel}>{obj.name} Length</h1>
        <span className="counter">
          <button
            id={idIncrement}
            name={obj.name}
            onClick={handleClick}
            value={1}
            disabled={disabled}
          >
            <i class="fas fa-chevron-circle-up"></i>
          </button>
          <h2 id={idLength}>{obj.counter}</h2>
          <button
            id={idDecrement}
            name={obj.name}
            onClick={handleClick}
            value={-1}
            disabled={disabled}
          >
            <i class="fas fa-chevron-circle-up"></i>
          </button>
        </span>
      </div>
    );
  });

  return <div className="Session">{sessions}</div>;
}

export default Session;

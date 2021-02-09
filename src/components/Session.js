import { FiArrowDownCircle, FiArrowUpCircle } from 'react-icons/fi';

function Session({ state, handleClick }) {
  const { arr, disabled } = state;

  const sessions = arr.map((obj) => {
    // Set the attributes for the buttons depending on whether it is 'Session' or 'Break'
    const idLabel = obj.name === 'Break' ? 'break-label' : 'session-label';
    const idDecrement =
      obj.name === 'Break' ? 'break-decrement' : 'session-decrement';
    const idIncrement =
      obj.name === 'Break' ? 'break-increment' : 'session-increment';
    const idLength = obj.name === 'Break' ? 'break-length' : 'session-length';

    return (
      <div className="singleSession" key={obj.name}>
        <h1 id={idLabel}>{obj.name} Time</h1>
        <span className="counter">
          {/* Button for increasing counter */}
          <button
            id={idIncrement}
            name={obj.name}
            onClick={handleClick}
            value={1}
            disabled={disabled}
          >
            <FiArrowUpCircle />
          </button>

          {/* Length of counter in minutes */}
          <h2 id={idLength}>{obj.counter} min</h2>

          {/* Button for decreasing counter */}
          <button
            id={idDecrement}
            name={obj.name}
            onClick={handleClick}
            value={-1}
            disabled={disabled}
          >
            <FiArrowDownCircle />
          </button>
        </span>
      </div>
    );
  });

  return <div className="Session">{sessions}</div>;
}

export default Session;

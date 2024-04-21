import { ReactElement, useState } from 'react';
import './styles/App.scss';
import { Board } from './components/Board';

export function App(): ReactElement {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const inputColors = ['white', 'random', 'black'];
  const [curVal, setCurVal] = useState<string>('white');
  let isFlipped: boolean = false;

  switch (curVal) {
    case 'white':
      isFlipped = false;
      break;
    case 'black':
      isFlipped = true;
      break;
    case 'random':
      isFlipped = Boolean(Math.floor(Math.random() * 2));
      break;
    default:
      break;
  }

  return (
    <>
      {!isPlaying && (
        <>
          <h1 className="header">Chess</h1>
          <form className="select-color_parent">
            {inputColors.map((i) => (
              <label
                className={`select-color_label select-color_${i} ${curVal === i ? 'select-color_label__active' : ''}`}
                htmlFor={`select_${i}`}
                key={`${i}_label`}
              >
                {' '}
                <input
                  type="radio"
                  name="select-color"
                  id={`select_${i}`}
                  className="select-color_input"
                  onChange={(e): void => {
                    if (e.target.id.slice(7) !== curVal)
                      setCurVal(e.target.id.slice(7));
                  }}
                  key={`${i}_input`}
                />
              </label>
            ))}
          </form>
          <button className="play-btn" onClick={(): void => setIsPlaying(true)}>
            Play
          </button>
        </>
      )}
      {isPlaying && <Board flipped={isFlipped} />}
      <a
        className="attribute-link"
        href="https://www.flaticon.com/free-icons/chess"
        title="chess icons"
      >
        Chess icons created by Pixel perfect - Flaticon
      </a>
    </>
  );
}

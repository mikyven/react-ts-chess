import { ReactElement, useState } from 'react';
import './styles/App.scss';
import { Board } from './components/Board';

export function App(): ReactElement {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  return (
    <>
      {!isPlaying && (
        <>
          <h1 className="header">Chess</h1>
          <button className="play-btn" onClick={(): void => setIsPlaying(true)}>
            Play
          </button>
        </>
      )}
      {isPlaying && <Board />}
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

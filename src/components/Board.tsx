import { ReactElement, useState } from 'react';
import '../styles/Board.scss';
import { Pawn } from './Pieces/Pawn';

export function Board(): ReactElement {
  interface PieceObj {
    piece: ReactElement;
    position: number;
  }

  function getSquareColor(sqrNum: string): string {
    return (+sqrNum[0] + +sqrNum[1]) % 2 === 0 ? 'black' : 'white';
  }

  function displayCoordinates(sqrNum: string): ReactElement | boolean {
    const lettersArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    if (sqrNum[1] === '1' && sqrNum[0] !== '1') {
      return <p className="coordinate coordinate__number">{sqrNum[0]}</p>;
    }
    if (sqrNum[0] === '1' && sqrNum[1] !== '1') {
      return (
        <p className="coordinate coordinate__letter">
          {lettersArr[+sqrNum[1] - 1]}
        </p>
      );
    }
    if (sqrNum[0] === '1' && sqrNum[1] === '1') {
      return (
        <>
          <p className="coordinate coordinate__number">{sqrNum[0]}</p>
          <p className="coordinate coordinate__letter">
            {lettersArr[+sqrNum[1] - 1]}
          </p>
        </>
      );
    }
    return false;
  }

  function fillSquaresArr(): string[] {
    const arr = [];

    for (let i = 1; i <= 8; i++) {
      for (let j = 1; j <= 8; j++) {
        arr[arr.length] = `${9 - i}${j}`;
      }
    }
    return arr;
  }

  function fillPawnsArr(): PieceObj[] {
    const WPawnsArr = [];
    const BPawnsArr = [];

    for (let i = 21; i <= 28; i++) {
      WPawnsArr[WPawnsArr.length] = {
        piece: <Pawn color="white" key={i} />,
        position: i,
      };
    }

    for (let i = 71; i <= 78; i++) {
      BPawnsArr[BPawnsArr.length] = {
        piece: <Pawn color="black" key={i} />,
        position: i,
      };
    }

    return WPawnsArr.concat(BPawnsArr);
  }

  const [squaresArr] = useState<string[]>(fillSquaresArr());
  const [piecesArr] = useState<PieceObj[]>(fillPawnsArr());

  return (
    <div className="board">
      {squaresArr.map((i) => (
        <div
          className={`square square-${i} square-${getSquareColor(i)}`}
          key={i}
        >
          {displayCoordinates(i)}
          {piecesArr.map((j) => (j.position === +i ? j.piece : false))}
        </div>
      ))}
    </div>
  );
}

import { ReactElement, useState } from 'react';
import '../styles/Board.scss';
import { King, Pawn, Knight, Bishop, Rook, Queen } from './Pieces';

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
        piece: <Pawn color="white" />,
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
  const [piecesArr] = useState<PieceObj[]>(
    [
      { piece: <Rook color="white" />, position: 11 },
      { piece: <Knight color="white" />, position: 12 },
      { piece: <Bishop color="white" />, position: 13 },
      { piece: <Queen color="white" />, position: 14 },
      { piece: <King color="white" />, position: 15 },
      { piece: <Bishop color="white" />, position: 16 },
      { piece: <Knight color="white" />, position: 17 },
      { piece: <Rook color="white" />, position: 18 },
    ].concat(fillPawnsArr(), [
      { piece: <Rook color="black" />, position: 81 },
      { piece: <Knight color="black" />, position: 82 },
      { piece: <Bishop color="black" />, position: 83 },
      { piece: <Queen color="black" />, position: 84 },
      { piece: <King color="black" />, position: 85 },
      { piece: <Bishop color="black" />, position: 86 },
      { piece: <Knight color="black" />, position: 87 },
      { piece: <Rook color="black" />, position: 88 },
    ])
  );

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

import { ReactElement, useRef, useState } from 'react';
import '../styles/Board.scss';
import { Piece } from './Pieces';
import { MoveDot } from './MoveDot';
import { onPawnClick, onRookClick } from './PiecesClickHandlers';

export function Board(): ReactElement {
  interface PieceObj {
    piece: string;
    pos: number;
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

  const [movesArr, setMovesArr] = useState<number[] | null>(null);

  function fillPawnsArr(): PieceObj[] {
    const arr: PieceObj[] = [];

    for (let w = 21; w <= 28; w++) {
      arr[arr.length] = {
        piece: 'wp',
        pos: w,
      };
    }
    for (let b = 71; b <= 78; b++) {
      arr[arr.length] = {
        piece: 'bp',
        pos: b,
      };
    }

    return arr;
  }

  const [squaresArr] = useState<string[]>(fillSquaresArr());
  const [piecesArr] = useState<PieceObj[]>(
    [
      {
        piece: 'wr',
        pos: 11,
      },
      {
        piece: 'wn',
        pos: 12,
      },
      {
        piece: 'wb',
        pos: 13,
      },
      {
        piece: 'wq',
        pos: 14,
      },
      {
        piece: 'wk',
        pos: 15,
      },
      {
        piece: 'wb',
        pos: 16,
      },
      {
        piece: 'wn',
        pos: 17,
      },
      {
        piece: 'wr',
        pos: 18,
      },
    ].concat(fillPawnsArr(), [
      {
        piece: 'br',
        pos: 81,
      },
      {
        piece: 'bn',
        pos: 82,
      },
      {
        piece: 'bb',
        pos: 83,
      },
      {
        piece: 'bq',
        pos: 84,
      },
      {
        piece: 'bk',
        pos: 85,
      },
      {
        piece: 'bb',
        pos: 86,
      },
      {
        piece: 'bn',
        pos: 87,
      },
      {
        piece: 'br',
        pos: 88,
      },
    ])
  );
  const posArr = Object.values(piecesArr).map((i) => i.pos);

  const [activePos, setActivePos] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement[] | null[]>([]);

  function defineOnClick(piece: string, pos: number): () => void | null {
    /* piece[0] is color
       piece[1] is piece name */
    let foo: (() => void) | null = null;
    switch (piece[1]) {
      case 'p':
        foo = (): void => setMovesArr(onPawnClick(piece[0], pos, posArr));
        break;
      case 'r':
        foo = (): void => setMovesArr(onRookClick(pos, posArr));
        break;
      default:
        break;
    }
    return () => {
      if (foo) foo();
      setActivePos(pos);
    };
  }

  return (
    <div className="board">
      {squaresArr.map((i) => (
        <div
          className={`square square-${i} square-${getSquareColor(i)} ${activePos === +i ? 'active' : ''}`}
          onClick={(): void => {
            if (!listRef.current[+i]?.children.length) {
              setMovesArr([]);
              setActivePos(null);
            }
          }}
          ref={(ref): HTMLDivElement | null =>
            listRef.current && (listRef.current[+i] = ref)
          }
          key={i}
        >
          {activePos === +i && <svg className="active" />}
          {displayCoordinates(i)}
          {piecesArr.map((j) =>
            j.pos === +i ? (
              <Piece
                piece={j.piece}
                onClick={defineOnClick(j.piece, j.pos)}
                key={i}
              />
            ) : (
              false
            )
          )}
          {movesArr?.map((k) =>
            +i === k && !posArr.includes(k) ? <MoveDot key={k} /> : null
          )}
        </div>
      ))}
    </div>
  );
}

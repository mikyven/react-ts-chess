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
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);

  function defineMoves(piece: string, pos: number): void {
    switch (piece[1]) {
      case 'p':
        setMovesArr(onPawnClick(piece[0], pos, posArr));
        break;
      case 'r':
        setMovesArr(onRookClick(pos, posArr));
        break;
      default:
        break;
    }
  }

  const [isMouseDown, setIsMouseDown] = useState(false);

  const onMouseDown = (e: React.MouseEvent): void => {
    setMovesArr([]);
    setActivePos(null);
    setIsMouseDown(true);
    const p = e.target as HTMLElement;
    if (p.classList.contains('piece')) {
      p.classList.add('dragging');
      setActivePiece(p);
      if (p.parentElement) {
        const pos = +p.parentElement.classList[1].slice(-2);
        setActivePos(pos);
        defineMoves(p.classList[1], pos);
      }
    }
  };

  const onMouseMove = (e: React.MouseEvent): void => {
    if (boardRef.current && isMouseDown && activePiece) {
      const boardX = boardRef.current.offsetLeft;
      const boardY = boardRef.current.offsetTop;

      const x = e.clientX > boardX ? e.clientX - 50 : boardX - 50;
      const y = e.clientY > boardY ? e.clientY - 50 : boardY - 50;

      activePiece.style.left = `${x}px`;
      activePiece.style.top = `${y}px`;
    }
  };

  const onMouseUp = (e: React.MouseEvent): void => {
    setIsMouseDown(false);
    if (activePiece) {
      activePiece.classList.remove('dragging');
      activePiece.style.left = '';
      activePiece.style.top = '';
      setActivePiece(null);

      if (boardRef.current) {
        const squareSize = boardRef.current.offsetHeight / 8;

        const bodyHeight = document.body.offsetHeight;
        const boardTop = boardRef.current.offsetTop;
        const y = e.clientY;
        const ySquare = Math.ceil((bodyHeight - y - boardTop) / squareSize);

        const boardLeft = boardRef.current.offsetLeft;
        const x = e.clientX;
        const xSquare = Math.ceil((x - boardLeft) / squareSize);

        setActivePos(+`${ySquare}${xSquare}`);
      }
    }
  };

  return (
    <div
      className="board"
      ref={boardRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {squaresArr.map((i) => (
        <div
          className={`square square-${i} square-${getSquareColor(i)} ${activePos === +i ? 'active' : ''}`}
          key={i}
        >
          {activePos === +i && <svg className="active" />}
          {displayCoordinates(i)}
          {piecesArr.map((j) =>
            j.pos === +i ? <Piece piece={j.piece} key={i} /> : false
          )}
          {movesArr?.map((k) =>
            +i === k && !posArr.includes(k) ? <MoveDot key={k} /> : null
          )}
        </div>
      ))}
    </div>
  );
}

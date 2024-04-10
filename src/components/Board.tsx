import { ReactElement, useRef, useState } from 'react';
import '../styles/Board.scss';
import { Piece } from './Pieces';
import {
  onBishopClick,
  onKnightClick,
  onPawnClick,
  onRookClick,
} from './PiecesClickHandlers';

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
  const [piecesArr, setPiecesArr] = useState<PieceObj[]>(
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

  const [activePosArr, setActivePosArr] = useState<number[]>([]);
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
      case 'n':
        setMovesArr(onKnightClick(pos, posArr));
        break;
      case 'b':
        setMovesArr(onBishopClick(pos, posArr));
        break;
      default:
        break;
    }
  }

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [move, setMove] = useState<number>(0);
  const turn = move % 2 === 0 ? 'w' : 'b';

  const movePiece = (newPos: number): void => {
    if (movesArr?.includes(newPos)) {
      setPiecesArr(
        piecesArr.map((i) =>
          activePosArr.includes(i.pos) ? { piece: i.piece, pos: newPos } : i
        )
      );
      setMove(move + 1);
      setMovesArr([]);
      setActivePosArr([...activePosArr, newPos]);
      setActivePiece(null);
    }
  };

  const onMouseDown = (e: React.MouseEvent): void => {
    const p = e.target as HTMLElement;

    if (
      activePiece &&
      activePiece.classList[1][0] === turn &&
      (p.classList.contains('square') || p.classList.contains('move-dot'))
    ) {
      let el = p;

      if (p.classList.contains('move-dot') && p.parentElement)
        el = p.parentElement;

      const pos = +el.classList[1].slice(-2);
      movePiece(pos);
      return;
    }

    setMovesArr([]);
    setActivePosArr([]);
    if (p.classList.contains('piece')) {
      setIsMouseDown(true);
      p.classList.add('dragging');
      setActivePiece(p);
      if (p.parentElement) {
        const pos = +p.parentElement.classList[1].slice(-2);
        setActivePosArr([pos]);
        if (p.classList[1][0] === turn) defineMoves(p.classList[1], pos);
      }
    }
  };

  const onMouseMove = (e: React.MouseEvent): void => {
    if (boardRef.current && isMouseDown && activePiece) {
      const boardX = boardRef.current.offsetLeft;
      const boardY = boardRef.current.offsetTop;
      const boardWidth = boardRef.current.offsetWidth;
      const boardHeight = boardRef.current.offsetHeight;
      const squareHalf = boardRef.current.offsetHeight / 16;

      const minX = boardX - squareHalf;
      const minY = boardY - squareHalf;
      const maxX = boardX + boardWidth - squareHalf;
      const maxY = boardY + boardHeight - squareHalf;

      let x = e.clientX - squareHalf;
      let y = e.clientY - squareHalf;

      if (x < minX) x = minX;
      else if (x > maxX) x = maxX;

      if (y < minY) y = minY;
      else if (y > maxY) y = maxY;

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
      if (activePosArr.length === 0) setActivePiece(null);
      const p = e.target as HTMLElement;

      if (p.classList[1][0] === turn && boardRef.current && movesArr) {
        const squareSize = boardRef.current.offsetHeight / 8;

        const bodyHeight = document.body.offsetHeight;
        const boardTop = boardRef.current.offsetTop;
        const y = e.clientY;
        const ySquare = Math.ceil((bodyHeight - y - boardTop) / squareSize);

        const boardLeft = boardRef.current.offsetLeft;
        const x = e.clientX;
        const xSquare = Math.ceil((x - boardLeft) / squareSize);

        const newPos = +`${ySquare}${xSquare}`;

        movePiece(newPos);
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
          className={`square square-${i} square-${getSquareColor(i)} ${activePosArr.includes(+i) ? 'active' : ''}`}
          key={i}
        >
          {activePosArr.includes(+i) && <svg className="active" />}
          {displayCoordinates(i)}
          {piecesArr.map((j) =>
            j.pos === +i ? <Piece piece={j.piece} key={i} /> : false
          )}
          {movesArr?.map((k) =>
            +i === k ? <div className="move-dot" key={k} /> : null
          )}
        </div>
      ))}
    </div>
  );
}

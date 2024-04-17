import { ReactElement, useRef, useState } from 'react';
import '../styles/Board.scss';
import { Piece } from './Pieces';
// import { onPieceGrab } from './PiecesGrabHandlers';

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

  const [movesArr, setMovesArr] = useState<number[] | null>(null);
  const [capturesArr, setCapturesArr] = useState<number[] | null>(null);

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
  // const posArr = Object.values(piecesArr).map((i) => i.pos);

  const [activePosArr, setActivePosArr] = useState<number[]>([]);
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [move, setMove] = useState<number>(0);
  const turn = move % 2 === 0 ? 'w' : 'b';

  const movePiece = (newPos: number): void => {
    if (movesArr?.includes(newPos) || capturesArr?.includes(newPos)) {
      setPiecesArr(
        piecesArr
          .filter((i) => i.pos !== newPos)
          .map((i) =>
            activePosArr.includes(i.pos) ? { piece: i.piece, pos: newPos } : i
          )
      );
      setMove(move + 1);
      setMovesArr([]);
      setCapturesArr([]);
      setActivePosArr([...activePosArr, newPos]);
      setActivePiece(null);
    }
  };

  const onMouseDown = (e: React.MouseEvent): void => {
    const p = e.target as HTMLElement;

    if (
      activePiece &&
      activePiece.classList[1][0] === turn &&
      ((p.children.length > 0 && p.children[0].classList.contains('hint')) ||
        p.classList.contains('hint'))
    ) {
      let el = p;

      if (p.classList.contains('hint') && p.parentElement) el = p.parentElement;

      const pos = +el.classList[1].slice(-2);
      movePiece(pos);
      return;
    }

    setMovesArr([]);
    setCapturesArr([]);
    setActivePosArr([]);
    if (p.classList.contains('piece')) {
      setIsMouseDown(true);
      p.classList.add('dragging');
      setActivePiece(p);
      if (p.parentElement) {
        const pos = +p.parentElement.classList[1].slice(-2);
        setActivePosArr([pos]);
        if (p.classList[1][0] === turn) {
          // const arr = onPieceGrab(
          //   p.classList[1],
          //   pos,
          //   posArr,
          //   piecesArr.map((i) => i.piece)
          // );
          // arr[0] and arr[1] under; if i put it there now it'll be an error
          setMovesArr([]);
          setCapturesArr([]);
        }
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

  const squaresArr = [];

  for (let x = 1; x <= 8; x++) {
    for (let y = 1; y <= 8; y++) {
      const pos = `${9 - x}${y}`;
      squaresArr.push(
        <div
          className={`square square-${pos} square-${getSquareColor(pos)} ${activePosArr.includes(+pos) ? 'active' : ''} `}
          key={pos}
        >
          {activePosArr.includes(+pos) && <svg className="active" />}
          {displayCoordinates(pos)}
          {piecesArr.map((j) =>
            j.pos === +pos ? <Piece piece={j.piece} key={pos} /> : false
          )}
          {movesArr?.map((k) =>
            +pos === k ? <div className="hint hint_move" key={k} /> : null
          )}
          {capturesArr?.map((k) =>
            +pos === k ? <div className="hint hint_capture" key={k} /> : null
          )}
        </div>
      );
    }
  }

  return (
    <div
      className="board"
      ref={boardRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {squaresArr}
    </div>
  );
}

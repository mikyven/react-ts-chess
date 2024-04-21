import { ReactElement, useRef, useState } from 'react';
import '../styles/Board.scss';
import { Piece } from './Pieces';
import { onPieceGrab } from './PiecesGrabHandlers';

export function Board(props: { flipped: boolean }): ReactElement {
  const { flipped } = props;
  interface PieceObj {
    piece: string;
    pos: number;
  }

  function getSquareColor(sqrNum: string): string {
    return (+sqrNum[0] + +sqrNum[1]) % 2 === 0 ? 'black' : 'white';
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
          .sort((a, b) => a.pos - b.pos)
      );
      setMove(move + 1);
      setMovesArr([]);
      setCapturesArr([]);
      setActivePosArr([...activePosArr, newPos]);
      setActivePiece(null);
    }
  };

  const findSquare = (e: React.MouseEvent): number => {
    if (boardRef.current) {
      const squareSize = boardRef.current.offsetHeight / 8;
      const boardLeft = boardRef.current.offsetLeft;
      const newX = e.clientX;
      const xSquare = Math.ceil((newX - boardLeft) / squareSize);

      const bodyHeight = document.body.offsetHeight;
      const boardTop = boardRef.current.offsetTop;
      const newY = e.clientY;
      const ySquare = Math.ceil((bodyHeight - newY - boardTop) / squareSize);

      return +`${ySquare}${xSquare}`;
    }
    return 0;
  };

  const onMouseDown = (e: React.MouseEvent): void => {
    if (e.button === 0) {
      const p = e.target as HTMLElement;

      if (
        p.parentElement &&
        (p.classList.contains('hint') || p.classList.contains('hint_child'))
      ) {
        const parent = p.parentElement;
        let el = parent;
        if (parent.parentElement && p.classList.contains('hint_child'))
          el = parent.parentElement;

        if (activePiece && activePiece.classList[1][0] === turn) {
          const pos = +el.classList[1].slice(-2);
          movePiece(pos);
          return;
        }
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
            const arr = onPieceGrab(
              p.classList[1],
              pos,
              piecesArr.map((i) => i.pos),
              piecesArr.map((i) => i.piece)
            );
            setMovesArr(arr[0]);
            setCapturesArr(arr[1]);
          }
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

      Object.values(boardRef.current.children)
        .map((i) => {
          i.classList.remove('hovered');
          return i;
        })
        .find((i) => i.classList.contains(`square-${findSquare(e)}`))
        ?.classList.add('hovered');
    }
  };

  const onMouseUp = (e: React.MouseEvent): void => {
    setIsMouseDown(false);
    if (activePiece && boardRef.current) {
      activePiece.classList.remove('dragging');
      activePiece.style.left = '';
      activePiece.style.top = '';
      const newPos = findSquare(e);
      Object.values(boardRef.current.children)
        .find((i) => i.classList.contains(`square-${newPos}`))
        ?.classList.remove('hovered');
      if (activePosArr.length === 0) setActivePiece(null);
      const p = e.target as HTMLElement;

      if (p.classList[1][0] === turn && (movesArr || capturesArr)) {
        movePiece(newPos);
      }
    }
  };

  const squaresArr: ReactElement[] = [];

  for (
    let x = flipped ? 8 : 1;
    flipped ? x >= 1 : x <= 8;
    flipped ? x-- : x++
  ) {
    for (
      let y = flipped ? 8 : 1;
      flipped ? y >= 1 : y <= 8;
      flipped ? y-- : y++
    ) {
      const pos = `${9 - x}${y}`;
      squaresArr.push(
        <div
          className={`square square-${pos} square-${getSquareColor(pos)} ${activePosArr.includes(+pos) ? 'active' : ''} `}
          key={pos}
        >
          {activePosArr.includes(+pos) && <svg className="active" />}
          {piecesArr.map((j) =>
            j.pos === +pos ? <Piece piece={j.piece} key={pos} /> : false
          )}
          {movesArr?.map((k) =>
            +pos === k ? (
              <div className="hint" key={k - 2387}>
                <div className="hint_child hint_move" />
              </div>
            ) : null
          )}
          {capturesArr?.map((k) =>
            +pos === k ? (
              <div className="hint" key={k + 9871}>
                <div className="hint_child hint_capture" />
              </div>
            ) : null
          )}
        </div>
      );
    }
  }

  const coordinates: ReactElement[][] = [[], []];

  for (let x = 1, y = 1; x <= 8 && y <= 8; x++, y++) {
    coordinates[0].push(
      <div className="coordinate" key={x + 947}>
        {9 - x}
      </div>
    );
    coordinates[1].push(
      <div className="coordinate" key={y + 484}>
        {String.fromCharCode(y + 96)}
      </div>
    );
  }

  return (
    <div
      className={`board${flipped ? ' flipped' : ''}`}
      ref={boardRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <div className="coordinate_parent">
        <div className="coordinates_vertical">{coordinates[0]}</div>
        <div className="coordinates_horizontal">{coordinates[1]}</div>
      </div>
      {squaresArr}
    </div>
  );
}

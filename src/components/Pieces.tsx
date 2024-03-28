import { ReactElement, useState } from 'react';
import '../styles/Pieces.scss';

export function Piece(props: {
  piece: string;
  onClick: () => void;
}): ReactElement {
  const { piece, onClick } = props;
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [startMouseCoords, setStartMouseCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const onGrab = (e: React.MouseEvent): void => {
    setStartMouseCoords({ x: e.clientX, y: e.clientY });
    const p = e.target as HTMLElement;
    p.classList.add('dragging');
    setIsMouseDown(true);
  };

  // const onDragStart = (e: React.MouseEvent): void => {
  //   const p = e.target as HTMLElement;
  //   p.classList.add('dragging');
  // };

  const onDrag = (e: React.MouseEvent): void => {
    if (isMouseDown) {
      const p = e.target as HTMLElement;

      p.style.transform = `translate(${startMouseCoords && e.clientX - startMouseCoords.x}px, ${startMouseCoords && e.clientY - startMouseCoords.y}px)`;
    }
  };

  return (
    <img
      className={`piece ${piece}`}
      onClick={onClick}
      onMouseDown={onGrab}
      // onDragStart={onDragStart}
      onDragOver={onDrag}
      onMouseUp={(): void => setIsMouseDown(false)}
      src={`src/images/${piece}.svg`}
      draggable="true"
      alt=""
    />
  );
}

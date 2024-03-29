import { ReactElement, useState } from 'react';
import '../styles/Pieces.scss';

export function Piece(props: {
  piece: string;
  onClick: () => void;
  boardCoords: { x: number; y: number };
}): ReactElement {
  const { piece, onClick, boardCoords } = props;
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const onGrab = (e: React.MouseEvent): void => {
    setIsMouseDown(true);
    const p = e.target as HTMLElement;
    p.classList.add('dragging');
  };

  const onDragOver = (e: React.MouseEvent): void => {
    if (isMouseDown) {
      const p = e.target as HTMLElement;

      const x = e.clientX > boardCoords.x ? e.clientX - 50 : boardCoords.x - 50;
      const y = e.clientY > boardCoords.x ? e.clientY - 50 : boardCoords.y - 50;

      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
    }
  };

  const onDragEnd = (e: React.MouseEvent): void => {
    setIsMouseDown(false);
    const p = e.target as HTMLElement;
    p.classList.remove('dragging');
  };

  return (
    <img
      className={`piece ${piece}`}
      onClick={onClick}
      onMouseDown={onGrab}
      onMouseMove={onDragOver}
      onMouseUp={onDragEnd}
      src={`src/images/${piece}.svg`}
      alt=""
      draggable={false}
    />
  );
}

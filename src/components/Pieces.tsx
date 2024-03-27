import { ReactElement, useState } from 'react';
import '../styles/Pieces.scss';

export function Piece(props: {
  piece: string;
  onClick: () => void;
}): ReactElement {
  const { piece, onClick } = props;
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const onGrab = (e: React.MouseEvent): void => {
    const p = e.target as HTMLElement;
    p.style.cursor = 'grab';
    setIsMouseDown(true);
  };

  const onDrag = (e: React.MouseEvent): void => {
    if (isMouseDown) {
      const p = e.target as HTMLElement;

      const x = e.clientX - 50;
      const y = e.clientY - 50;

      p.style.cursor = 'grabbing';
      p.style.position = 'absolute';
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
    }
  };

  return (
    <img
      className={`piece ${piece}`}
      onClick={onClick}
      onMouseDown={onGrab}
      onMouseMove={onDrag}
      onMouseUp={(): void => setIsMouseDown(false)}
      src={`src/images/${piece}.svg`}
      draggable="false"
      alt=""
    />
  );
}

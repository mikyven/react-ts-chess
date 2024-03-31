import { ReactElement } from 'react';
import '../styles/Pieces.scss';

export function Piece(props: {
  piece: string;
  // onClick: () => void;
  // dragFuncs: Record<'down' | 'move' | 'up', (e: React.MouseEvent) => void>;
}): ReactElement {
  const { piece } = props;

  return (
    <img
      className={`piece ${piece}`}
      // onClick={onClick}
      // onMouseDown={dragFuncs.down}
      // onMouseMove={dragFuncs.move}
      // onMouseUp={dragFuncs.up}
      src={`src/images/${piece}.svg`}
      alt=""
      draggable={false}
    />
  );
}

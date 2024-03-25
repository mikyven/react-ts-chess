import { ReactElement } from 'react';
import '../styles/Pieces.scss';

export function Piece(props: {
  piece: string;
  onClick: () => void;
}): ReactElement {
  const { piece, onClick } = props;

  return (
    <img
      className={`piece ${piece}`}
      onClick={onClick}
      src={`src/images/${piece}.svg`}
      alt=""
      draggable="false"
    />
  );
}

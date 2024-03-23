import { ReactElement } from 'react';
import '../styles/Pieces.scss';

export function Piece(props: {
  piece: string;
  onClick: () => void;
}): ReactElement {
  const { piece, onClick } = props;

  const realOnClick = (): void => {
    onClick();
  };

  return (
    <img
      className={`piece ${piece}`}
      onClick={realOnClick}
      src={`src/images/${piece}.svg`}
      alt=""
      draggable="false"
    />
  );
}

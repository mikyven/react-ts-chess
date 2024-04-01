import { ReactElement } from 'react';
import '../styles/Pieces.scss';

export function Piece(props: { piece: string }): ReactElement {
  const { piece } = props;

  return (
    <img
      className={`piece ${piece}`}
      src={`src/images/${piece}.svg`}
      alt=""
      draggable="false"
    />
  );
}

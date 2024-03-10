import { ReactElement } from 'react';
import '../../styles/Pieces.scss';

export function Piece(props: { src: string; alt: string }): ReactElement {
  const { src, alt } = props;

  return <img className="piece" src={src} alt={alt} draggable="false" />;
}

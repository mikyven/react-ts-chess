import { ReactElement } from 'react';
import WPawnImg from '../../images/wpawn.svg';
import BPawnImg from '../../images/bpawn.svg';
import { Piece } from './Piece';

export function Pawn(props: { color: string }): ReactElement {
  const { color } = props;

  return color === 'white' ? (
    <Piece src={WPawnImg} alt="White Pawn" />
  ) : (
    <Piece src={BPawnImg} alt="Black Pawn" />
  );
}

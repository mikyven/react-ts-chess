import { ReactElement } from 'react';
import '../styles/Pieces.scss';
import WKing from '../images/wk.svg';
import BKing from '../images/bk.svg';
import WPawn from '../images/wp.svg';
import BPawn from '../images/bp.svg';
import WKnight from '../images/wn.svg';
import BKnight from '../images/bn.svg';
import WBishop from '../images/wb.svg';
import BBishop from '../images/bb.svg';
import WRook from '../images/wr.svg';
import BRook from '../images/br.svg';
import WQueen from '../images/wq.svg';
import BQueen from '../images/bq.svg';

function Piece(props: {
  wsrc: string;
  bsrc: string;
  alt: string;
  color: string;
}): ReactElement {
  const { wsrc, bsrc, alt, color } = props;

  return color === 'white' ? (
    <img className="piece" src={wsrc} alt={alt} draggable="false" />
  ) : (
    <img className="piece" src={bsrc} alt={alt} draggable="false" />
  );
}

export function King(props: { color: string }): ReactElement {
  const { color } = props;
  return <Piece wsrc={WKing} bsrc={BKing} alt="King" color={color} />;
}

export function Pawn(props: { color: string }): ReactElement {
  const { color } = props;
  return <Piece wsrc={WPawn} bsrc={BPawn} alt="Pawn" color={color} />;
}

export function Knight(props: { color: string }): ReactElement {
  const { color } = props;
  return <Piece wsrc={WKnight} bsrc={BKnight} alt="Knight" color={color} />;
}

export function Bishop(props: { color: string }): ReactElement {
  const { color } = props;
  return <Piece wsrc={WBishop} bsrc={BBishop} alt="Bishop" color={color} />;
}

export function Rook(props: { color: string }): ReactElement {
  const { color } = props;
  return <Piece wsrc={WRook} bsrc={BRook} alt="Rook" color={color} />;
}

export function Queen(props: { color: string }): ReactElement {
  const { color } = props;
  return <Piece wsrc={WQueen} bsrc={BQueen} alt="Queen" color={color} />;
}

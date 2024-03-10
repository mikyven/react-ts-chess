import { ReactElement } from 'react';
import './styles/App.scss';
import { Board } from './components/Board';

// import BKingImg from '../images/bking.svg';

// import BKnightImg from '../images/bknight.svg';
// import BBishopImg from '../images/bbishop.svg';
// import BRookImg from '../images/brook.svg';
// import BQueenImg from '../images/bqueen.svg';
// import WKingImg from '../images/wking.svg';

// import WKnightImg from '../images/wknight.svg';
// import WBishopImg from '../images/wbishop.svg';
// import WRookImg from '../images/wrook.svg';
// import WQueenImg from '../images/wqueen.svg';

export function App(): ReactElement {
  return <Board />;
}

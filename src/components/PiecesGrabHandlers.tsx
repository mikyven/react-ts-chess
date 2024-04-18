function findNearestPiece(
  arr: number[],
  pos: number,
  index: number,
  sign: string
): number {
  const oppositeIndex = index - 1 === 0 ? index - 1 : index + 1;
  arr = arr.filter((i: number) => {
    if (
      String(i)[index] !== String(pos)[index] &&
      String(i)[oppositeIndex] === String(pos)[oppositeIndex] &&
      (sign === '>' ? i > pos : i < pos)
    ) {
      return `${i}`[index];
    }
    return false;
  });
  return sign === '>' ? +arr.slice(0, 1) : +arr.slice(-1);
}

export function onPieceGrab(
  piece: string,
  curPos: number,
  posArr: number[],
  piecesArr: string[]
): number[][] {
  const color = piece[0];
  const moveFilter = (i: number): boolean =>
    !posArr.includes(i) && `${i}`.match(/[1-8]/g)?.length === `${i}`.length;
  const captureFilter = (i: number): boolean =>
    posArr.includes(i) &&
    `${i}`.match(/[1-8]/g)?.length === `${i}`.length &&
    piecesArr[posArr.indexOf(i)][0] !== color &&
    piecesArr[posArr.indexOf(i)][1] !== 'k';

  function findPawnMoves(): number[][] {
    const movesArr: number[] = [];
    const capturesArr: number[] = [];
    const movesNumber =
      (color === 'w' && curPos <= 28) || (color === 'b' && curPos >= 71)
        ? 20
        : 10;

    for (
      let i = color === 'w' ? curPos + 10 : curPos - movesNumber;
      i <= (color === 'w' ? curPos + movesNumber : curPos);
      i += 10
    ) {
      movesArr.push(i);
      if (color === 'w' ? i === curPos + 10 : i === curPos - 10)
        capturesArr.push(i - 1, i + 1);
    }

    return [movesArr.filter(moveFilter), capturesArr.filter(captureFilter)];
  }

  function findKnightMoves(): number[][] {
    const arr: number[] = [];
    for (let i = curPos - 20; i <= curPos + 21; i += 40) {
      arr.push(i - 1, i + 1);
    }
    for (let i = curPos - 10; i <= curPos + 12; i += 20) {
      arr.push(i - 2, i + 2);
    }

    return [arr.filter(moveFilter), arr.filter(captureFilter)];
  }

  function findKingMoves(): number[][] {
    const arr: number[] = [];

    for (let i = curPos - 10; i <= curPos + 10; i += 10) {
      arr.push(i - 1, i, i + 1);
    }

    return [arr.filter(moveFilter), arr.filter(captureFilter)];
  }

  function findStraightMoves(): number[][] {
    const arr: number[] = [];

    const nearPieces: Record<'up' | 'down' | 'right' | 'left', number> = {
      up: findNearestPiece(posArr, curPos, 0, '>'),
      down: findNearestPiece(posArr, curPos, 0, '<'),
      right: findNearestPiece(posArr, curPos, 1, '>'),
      left: findNearestPiece(posArr, curPos, 1, '<'),
    };

    for (
      let i = nearPieces.down || +'1'.concat(`${curPos}`[1]);
      i <= (nearPieces.up || +'8'.concat(`${curPos}`[1]));
      i += 10
    ) {
      arr.push(i);
    }
    for (
      let i = nearPieces.left || +`${curPos}`[0].concat('1');
      i <= (nearPieces.right || +`${curPos}`[0].concat('8'));
      i += 1
    ) {
      arr.push(i);
    }

    return [arr.filter(moveFilter), arr.filter(captureFilter)];
  }

  function findDiagonalMoves(): number[][] {
    const movesArr: number[] = [];

    const findFurthestPos = (
      pos: number,
      val: number,
      type: string
    ): number => {
      let minPos: number = 0;
      for (
        let i = pos;
        !`${i}`.split('').some((j) => +j < 1 || +j > 8) &&
        i >= 11 &&
        i <= 88 &&
        (!posArr.includes(i) || i === curPos);
        type === 'max' ? (i += val) : (i -= val)
      ) {
        minPos = i;
      }
      return minPos;
    };

    const firstMin = findFurthestPos(curPos, 11, 'min');
    const firstMax = findFurthestPos(curPos, 11, 'max');
    const secondMin = findFurthestPos(curPos, 9, 'min');
    const secondMax = findFurthestPos(curPos, 9, 'max');

    for (let i = firstMin; i <= firstMax; i += 11) {
      if (i !== curPos) movesArr.push(i);
    }

    for (let i = secondMin; i <= secondMax; i += 9) {
      if (i !== curPos) movesArr.push(i);
    }

    return [movesArr, []];
  }

  switch (piece[1]) {
    case 'p':
      return findPawnMoves();
    case 'r':
      return findStraightMoves();
    case 'n':
      return findKnightMoves();
    case 'b':
      return findDiagonalMoves();
    case 'q':
      return findStraightMoves().concat(findDiagonalMoves());
    case 'k':
      return findKingMoves();
    default:
      return [];
  }
}

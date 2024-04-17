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
): number[] | number[][] {
  const color = piece[0];
  function findPawnMoves(): number[][] {
    const movesArr: number[] = [];
    const movesNumber =
      (color === 'w' && curPos <= 28) || (color === 'b' && curPos >= 71)
        ? 20
        : 10;

    for (
      let i = color === 'w' ? curPos + 10 : curPos - movesNumber;
      i <= (color === 'w' ? curPos + movesNumber : curPos) &&
      !posArr.includes(i) &&
      i >= 11 &&
      i <= 88;
      i += 10
    ) {
      movesArr.push(i);
    }

    return [
      movesArr,
      posArr.filter(
        (i) =>
          (color === 'w'
            ? i === curPos + 9 || i === curPos + 11
            : i === curPos - 9 || i === curPos - 11) &&
          piecesArr[posArr.indexOf(i)][0] !== piece[0]
      ),
    ];
  }

  function findStraightMoves(): number[] {
    const movesArr: number[] = [];

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
      movesArr.push(i);
    }
    for (
      let i = nearPieces.left || +`${curPos}`[0].concat('1');
      i <= (nearPieces.right || +`${curPos}`[0].concat('8'));
      i += 1
    ) {
      movesArr.push(i);
    }

    return movesArr.filter((i) => !posArr.includes(i));
  }

  function findKnightMoves(): number[] {
    const movesArr: number[] = [];
    for (let i = curPos - 20; i <= curPos + 21; i += 40) {
      movesArr.push(i - 1, i + 1);
    }
    for (let i = curPos - 10; i <= curPos + 12; i += 20) {
      movesArr.push(i - 2, i + 2);
    }

    return movesArr.filter(
      (i) => !posArr.includes(i) && i >= 11 && i <= 88 && +`${i}`[1] <= 8
    );
  }

  function findDiagonalMoves(): number[] {
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

    return movesArr;
  }

  function findKingMoves(): number[][] {
    const movesArr: number[] = [];

    // it's not according to the rules now, but i'll remake it later

    for (let i = curPos - 10; i <= curPos + 10; i += 10) {
      movesArr.push(i - 1, i, i + 1);
    }

    return [
      movesArr.filter((i) => !posArr.includes(i)),
      movesArr.filter(
        (i) => posArr.includes(i) && piecesArr[posArr.indexOf(i)][0] !== color
      ),
    ];
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

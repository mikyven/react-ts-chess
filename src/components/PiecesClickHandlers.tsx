function findPiece(
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

export function onPawnClick(
  color: string,
  curPos: number,
  posArr: number[]
): number[] {
  // const nearestPieceAbove = findPiece(posArr, curPos, 0, '>')
  const movesArr: number[] = [];
  const movesNumber =
    (color === 'w' && curPos <= 28) || (color === 'b' && curPos <= 71) ? 2 : 1;

  if (color === 'w')
    for (let i = curPos + 10; i <= curPos + movesNumber * 10; i += 10) {
      movesArr.push(i);
    }
  else
    for (let i = curPos - movesNumber * 10; i < curPos; i += 10) {
      movesArr.push(i);
    }

  return movesArr.filter((i) => posArr.includes(i));
}

export function onRookClick(curPos: number, posArr: number[]): number[] {
  const movesArr: number[] = [];

  const nearPieces: Record<'up' | 'down' | 'right' | 'left', number> = {
    up: findPiece(posArr, curPos, 0, '>'),
    down: findPiece(posArr, curPos, 0, '<'),
    right: findPiece(posArr, curPos, 1, '>'),
    left: findPiece(posArr, curPos, 1, '<'),
  };

  // vertical
  for (
    let i = nearPieces.down || +'1'.concat(`${curPos}`[1]);
    i <= (nearPieces.up || +'8'.concat(`${curPos}`[1]));
    i += 10
  ) {
    movesArr.push(i);
  }

  // horizontal
  for (
    let i = nearPieces.left || +`${curPos}`[0].concat('1');
    i <= (nearPieces.right || +`${curPos}`[0].concat('8'));
    i += 1
  ) {
    movesArr.push(i);
  }

  return posArr.filter((i) => posArr.includes(i));
}

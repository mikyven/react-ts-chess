function findPiece(arr: number[], pos: number, dir: string): number {
  const index = dir === 'u' || dir === 'd' ? 0 : 1;
  const sign = dir === 'u' || dir === 'r' ? '>' : '<';
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
  if (
    (color === 'w' && findPiece(posArr, curPos, 'u') === curPos + 10) ||
    (color === 'b' && findPiece(posArr, curPos, 'd') === curPos - 10)
  ) {
    return [];
  }

  const movesArr: number[] = [];
  const movesNumber =
    (color === 'w' && curPos <= 28) || (color === 'b' && curPos >= 71) ? 2 : 1;

  if (color === 'w') {
    for (let i = curPos + 10; i <= curPos + movesNumber * 10; i += 10) {
      movesArr.push(i);
    }
  } else if (color === 'b') {
    for (let i = curPos - movesNumber * 10; i < curPos; i += 10) {
      movesArr.push(i);
    }
  }

  return movesArr.filter(
    (i) => !posArr.includes(i) && i >= 11 && i <= 88 && +`${i}`[1] <= 8
  );
}

export function onRookClick(curPos: number, posArr: number[]): number[] {
  const movesArr: number[] = [];

  const nearPieces: Record<'up' | 'down' | 'right' | 'left', number> = {
    up: findPiece(posArr, curPos, 'u'),
    down: findPiece(posArr, curPos, 'd'),
    right: findPiece(posArr, curPos, 'r'),
    left: findPiece(posArr, curPos, 'l'),
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

  return movesArr.filter((i) => !posArr.includes(i));
}

export function onKnightClick(curPos: number, posArr: number[]): number[] {
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

export function onBishopClick(curPos: number, posArr: number[]): number[] {
  const movesArr: number[] = [];

  for (let i = curPos + 11; i <= 88; i += 11) {
    if (posArr.includes(i)) break;
    movesArr.push(i);
  }

  return movesArr.filter(
    (i) => !posArr.includes(i) && i >= 11 && i <= 88 && +`${i}`[1] <= 8
  );
}

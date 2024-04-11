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

function diagonalFilterFunc(curPos: number, num: number, sign: string) {
  return (n: number): boolean =>
    (sign === '>' ? n > curPos : n < curPos) &&
    (num === 1 ? curPos % 11 === n % 11 : curPos % 9 === n % 9);
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

  let firstMin = Math.max(...posArr.filter(diagonalFilterFunc(curPos, 1, '<')));
  let firstMax = Math.min(...posArr.filter(diagonalFilterFunc(curPos, 1, '>')));
  let secondMin = Math.max(
    ...posArr.filter(diagonalFilterFunc(curPos, 2, '<'))
  );
  let secondMax = Math.min(
    ...posArr.filter(diagonalFilterFunc(curPos, 2, '>'))
  );

  if (firstMin === -Infinity) firstMin = (curPos % 11) + 11;
  if (firstMax === Infinity) firstMax = 88 + (curPos % 11);
  if (secondMin === -Infinity) secondMin = (curPos % 9) + 9;
  if (secondMax === Infinity) secondMax = 88 + (curPos % 9);

  for (let i = firstMin; i <= firstMax; i += 11) {
    if (!posArr.includes(i)) movesArr.push(i);
  }

  for (let i = secondMin; i <= secondMax; i += 9) {
    if (!posArr.includes(i)) movesArr.push(i);
  }

  return movesArr;
}

export function onQueenClick(curPos: number, posArr: number[]): number[] {
  const movesArr: number[] = [curPos - 1, curPos + 1, curPos - 10, curPos + 10];

  let firstMin = Math.max(...posArr.filter(diagonalFilterFunc(curPos, 1, '<')));
  let firstMax = Math.min(...posArr.filter(diagonalFilterFunc(curPos, 1, '>')));
  let secondMin = Math.max(
    ...posArr.filter(diagonalFilterFunc(curPos, 2, '<'))
  );
  let secondMax = Math.min(
    ...posArr.filter(diagonalFilterFunc(curPos, 2, '>'))
  );

  if (firstMin === -Infinity) firstMin = (curPos % 11) + 11;
  if (firstMax === Infinity) firstMax = 88 + (curPos % 11);
  if (secondMin === -Infinity) secondMin = (curPos % 9) + 9;
  if (secondMax === Infinity) secondMax = 88 + (curPos % 9);

  for (let i = firstMin; i <= firstMax; i += 11) {
    if (!posArr.includes(i)) movesArr.push(i);
  }

  for (let i = secondMin; i <= secondMax; i += 9) {
    if (!posArr.includes(i)) movesArr.push(i);
  }

  return movesArr;
}

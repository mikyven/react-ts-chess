export function onPawnClick(color: string, curPos: number): number[] {
  if (color === 'w') {
    return curPos <= 28 ? [curPos + 10, curPos + 20] : [curPos + 10];
  }
  return curPos >= 71 ? [curPos - 10, curPos - 20] : [curPos - 10];
}

export function onRookClick(curPos: number, extPosArr: number[]): number[] {
  const posArr: number[] = [];

  function findPiece(arr: number[], index: number, sign: string): number {
    arr = arr.filter((i: number) => {
      if (
        i !== curPos &&
        `${i}`[index] !== `${curPos}`[index] &&
        (index - 1 === 0
          ? `${i}`[index - 1] === `${curPos}`[index - 1]
          : `${i}`[index + 1] === `${curPos}`[index + 1]) &&
        (sign === '>' ? i > curPos : i < curPos)
      ) {
        return `${i}`[index];
      }
      return false;
    });
    return sign === '>' ? +arr.slice(0, 1) : +arr.slice(-1);
  }

  const nearPieces: Record<'up' | 'down' | 'right' | 'left', number> = {
    up: findPiece(extPosArr, 0, '>'),
    down: findPiece(extPosArr, 0, '<'),
    right: findPiece(extPosArr, 1, '>'),
    left: findPiece(extPosArr, 1, '<'),
  };

  // vertical
  for (
    let i = nearPieces.down || +'1'.concat(`${curPos}`[1]);
    i <= (nearPieces.up || +'8'.concat(`${curPos}`[1]));
    i += 10
  ) {
    posArr.push(i);
  }

  // horizontal
  for (
    let i = nearPieces.left || +`${curPos}`[0].concat('1');
    i <= (nearPieces.right || +`${curPos}`[0].concat('8'));
    i += 1
  ) {
    posArr.push(i);
  }

  return posArr;
}

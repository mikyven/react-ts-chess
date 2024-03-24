export function onPawnClick(color: string, curPos: number): number[] {
  if (color === 'w') {
    return curPos <= 28 ? [curPos + 10, curPos + 20] : [curPos + 10];
  }
  return curPos >= 71 ? [curPos - 10, curPos - 20] : [curPos - 10];
}

export function onRookClick(
  color: string,
  curPos: number,
  extPosArr: number[]
): number[] {
  const posArr: number[] = [];

  function fillIndexesArr(arr: number[], sign: string): number[] {
    const revdArr = [...arr].reverse();
    const searchForPieces = (a: number[], index: number): number =>
      a
        .map((i: number) => {
          if (
            i !== curPos && String(i)[1] === String(curPos)[1] && sign === '>'
              ? i > curPos
              : i < curPos
          ) {
            return `${i}`[index];
          }
          return false;
        })
        .indexOf(`${curPos}`[index]);

    if (color === 'w') {
      return [arr[searchForPieces(arr, 1)], arr[searchForPieces(arr, 0)]];
    }

    return [
      revdArr[searchForPieces(revdArr, 1)],
      revdArr[searchForPieces(revdArr, 0)],
    ];
  }

  const nextPieceIndexes: number[] = fillIndexesArr(extPosArr, '>');
  const prevPieceIndexes: number[] = fillIndexesArr(extPosArr, '<');

  // vertical
  for (
    let i = prevPieceIndexes[0] || +'1'.concat(`${curPos}`[1]);
    i <= (nextPieceIndexes[0] || +'8'.concat(`${curPos}`[1]));
    i += 10
  ) {
    posArr.push(i);
  }

  // horizontal
  for (
    let i = prevPieceIndexes[1] || +`${curPos}`[0].concat('1');
    i <= (nextPieceIndexes[1] || +`${curPos}`[0].concat('8'));
    i += 1
  ) {
    posArr.push(i);
  }

  return posArr;
}

export function onPawnClick(color: string, curPos: number): number[] {
  if (color === 'w') {
    return curPos <= 28 ? [curPos + 10, curPos + 20] : [curPos + 10];
  }
  return curPos >= 71 ? [curPos - 10, curPos - 20] : [curPos - 10];
}

export function onRookClick(curPos: number, extPosArr: number[]): number[] {
  const posArr: number[] = [];

  /* eslint-disable prettier/prettier */
  const nextPieceIndexes: number[] = [
    extPosArr[
    extPosArr
      .map((i) => (i !== curPos && i > curPos ? `${i}`[1] : false))
      .indexOf(`${curPos}`[1])
    ],
    extPosArr[
    extPosArr
      .map((i) => (i !== curPos && i > curPos ? `${i}`[0] : false))
      .indexOf(`${curPos}`[0])
    ],
  ];

  const prevPieceIndexes: number[] = [
    extPosArr[
    extPosArr
      .map((i) => (i !== curPos && i < curPos ? `${i}`[1] : false))
      .indexOf(`${curPos}`[1])
    ],
    extPosArr[
    extPosArr
      .map((i) => (i !== curPos && i < curPos ? `${i}`[0] : false))
      .indexOf(`${curPos}`[0])
    ],
  ];
  /* eslint-enable prettier/prettier */

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


export const generateGame = () => {
  let nums = [];

  while (nums.length < 5) {
    let n = Math.floor(Math.random() * 100);
    if (!nums.includes(n)) nums.push(n);
  }

  return {
    row1: shuffleArray(nums),
    row2: shuffleArray(nums),
  };
};


export const shuffleArray = (arr) => {
  let newArr = [...arr];

  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }

  return newArr;
};

export const shuffleUnmatched = (row, matched) => {
  const unmatched = row.filter((n) => !matched.includes(n));
  const shuffled = shuffleArray(unmatched);

  let index = 0;

  return row.map((n) => {
    if (matched.includes(n)) return n;
    return shuffled[index++];
  });
};
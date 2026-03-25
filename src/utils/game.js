export const generateGame = () => {
  let nums = [];

  while (nums.length < 5) {
    let n = Math.floor(Math.random() * 100);
    if (!nums.includes(n)) nums.push(n);
  }

  return {
    row1: nums,
    row2: [...nums].sort(() => Math.random() - 0.5)
  };
};

export const shuffleUnmatched = (row, matched) => {
  const unmatched = row.filter(n => !matched.includes(n));
  const shuffled = [...unmatched].sort(() => Math.random() - 0.5);

  let index = 0;

  return row.map(n => {
    if (matched.includes(n)) return n;
    return shuffled[index++];
  });
};
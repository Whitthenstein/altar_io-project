export const createEmptyGrid = () => {
  const grid: string[][] = [];

  for (let i = 0; i < 10; i++) {
    const row: string[] = [];

    for (let j = 0; j < 10; j++) {
      row.push("");
    }

    grid.push(row);
  }

  return grid;
};

import { createGrid, divideByLowestIntegerPossible } from "./utils";

type GeneratorType = {
  currentGrid: string[][] | null;
  currentCode: number | null;
  biasedCharacter: string | null;
};

export const generator: GeneratorType = {
  currentGrid: null,
  currentCode: null,
  biasedCharacter: null,
};

export const generateNewGridAndCode = () => {
  const currentSeconds = new Date().getSeconds();
  const x = Math.floor(currentSeconds / 10);
  const y = currentSeconds % 10;

  generator.currentGrid = createGrid(generator.biasedCharacter);

  const firstLetter = generator.currentGrid[x][y];
  const secondLetter = generator.currentGrid[y][x];
  let firstLetterOcurrences = 0,
    secondLetterOcurrences = 0;

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (generator.currentGrid[i][j] === firstLetter) {
        firstLetterOcurrences += 1;
      }
      if (generator.currentGrid[i][j] === secondLetter) {
        secondLetterOcurrences += 1;
      }
    }
  }

  firstLetterOcurrences =
    firstLetterOcurrences > 9
      ? divideByLowestIntegerPossible(firstLetterOcurrences)
      : firstLetterOcurrences;

  secondLetterOcurrences =
    secondLetterOcurrences > 9
      ? divideByLowestIntegerPossible(secondLetterOcurrences)
      : secondLetterOcurrences;

  generator.currentCode = firstLetterOcurrences * 10 + secondLetterOcurrences;
};

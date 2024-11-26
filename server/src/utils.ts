import { A_CODE, Z_CODE } from "./constants";

const getRandomArbitraryNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const getArrayOfCharacters = () => {
  const arr = [];
  for (let i = 0; i < 100; i++) {
    arr.push(String.fromCharCode(getRandomArbitraryNumber(A_CODE, Z_CODE + 1)));
  }

  return arr;
};

const getArrayOfCharactersBiased = (biasedCharCode: number) => {
  const arr = [];

  for (let i = 0; i < 20; i++) {
    arr.push(String.fromCharCode(biasedCharCode));
  }
  for (let i = 20; i < 100; i++) {
    arr.push(String.fromCharCode(getRandomArbitraryNumber(A_CODE, Z_CODE + 1)));
  }

  return arr;
};

export const createGrid = (biasedCharacter: string | null) => {
  const grid: string[][] = [];

  const arrayOfChars = biasedCharacter
    ? getArrayOfCharactersBiased(biasedCharacter.charCodeAt(0))
    : getArrayOfCharacters();

  for (let i = 0; i < 10; i++) {
    const row: string[] = [];

    for (let j = 0; j < 10; j++) {
      const randomIndex = getRandomArbitraryNumber(0, arrayOfChars.length);
      row.push(arrayOfChars[randomIndex]);
      arrayOfChars.splice(randomIndex, 1);
    }

    grid.push(row);
  }

  return grid;
};

export const divideByLowestIntegerPossible = (num: number) => {
  if (num < 10) {
    return num;
  }

  let divisor = 2;
  let result = num / divisor;
  while (result % 1 !== 0 || result > 9) {
    divisor += 1;
    result = num / divisor;
  }

  return result;
};

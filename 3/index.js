import { open } from 'node:fs/promises';

const isCharacterNumberOrPointOrUndefined = (character) => {
  if (character === undefined) {
    return true;
  }
  if (isFinite(character)) {
    return true;
  }
  if(character === ".") {
    return true;
  }
  
  return false;
}

const checkLineAndReturnValidSum = (matrixCache, lineNumber) => {
  let currentLineSum = 0;
  let currentNumber = '';
  let currentNumberIsValid = false;

  // check line
  matrixCache[lineNumber].forEach((character, characterIndex) => {
    if (!isFinite(character) && currentNumberIsValid && currentNumber.length > 0) { 
      // add valid number to sum
      currentLineSum += Number(currentNumber);
    } 

    if (!isFinite(character)) {
      // reset condition
      currentNumber = '';
      currentNumberIsValid = false;
      return;
    }

    // save number when occours
    currentNumber += character;

    if (currentNumberIsValid) {
      // already a valid number, move forward
      return;
    }


    // check if its a valid number
    // check character around in this case
    // invalid current number if a check does not pass
    if (
      !isCharacterNumberOrPointOrUndefined((matrixCache[lineNumber-1] || [])[characterIndex-1])
      || !isCharacterNumberOrPointOrUndefined((matrixCache[lineNumber-1] || [])[characterIndex])
      || !isCharacterNumberOrPointOrUndefined((matrixCache[lineNumber-1] || [])[characterIndex+1])

      || !isCharacterNumberOrPointOrUndefined(matrixCache[lineNumber][characterIndex-1])
      || !isCharacterNumberOrPointOrUndefined(matrixCache[lineNumber][characterIndex+1])

      || !isCharacterNumberOrPointOrUndefined((matrixCache[lineNumber+1] || [])[characterIndex-1])
      || !isCharacterNumberOrPointOrUndefined((matrixCache[lineNumber+1] || [])[characterIndex])
      || !isCharacterNumberOrPointOrUndefined((matrixCache[lineNumber+1] || [])[characterIndex+1])
    ) {
      currentNumberIsValid = true;
    }
  })

  // add last number before newline when valid
  return currentLineSum + (currentNumberIsValid ? Number(currentNumber) : 0);
}
  
const inputFile = await open('./input.txt');
// Determine which games would have been possible if the bag had been loaded with only 12 red cubes, 13 green cubes, and 14 blue cubes. What is the sum of the IDs of those games
let totalPoints = 0;

// 467..114..
// ...*......
// ..35..633.
// ......#...
// 617*......
// .....+.58.
// ..592.....
// ......755.
// ...$.*....
// .664.598..
let threeRowsMatrixCache = [];
let lineNumber = -1;
for await (const line of inputFile.readLines()) {
  lineNumber++;
  const newRow = [];
  // did anyone say slicing window?
  if (lineNumber > 2) {
    threeRowsMatrixCache = threeRowsMatrixCache.slice(1);
  }
	for (const character of line) {
    newRow.push(character)
	}
  threeRowsMatrixCache.push(newRow);
  // check first line - start
  if (lineNumber === 1) {
    totalPoints += checkLineAndReturnValidSum(threeRowsMatrixCache, 0);
  }
  // check mid line - slicing!
  if (lineNumber > 1) {
    totalPoints += checkLineAndReturnValidSum(threeRowsMatrixCache, 1);
  }
}
// check last line - end
if (lineNumber > 1) {
  totalPoints += checkLineAndReturnValidSum(threeRowsMatrixCache, 2);
}

console.log(totalPoints);

// PART 2

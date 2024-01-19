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


const addToTuplesNumbers = (tuples, line, x, y) => {
  const threeCharactersToCheck = line.slice(x-1, x+2)
  // 0 0 0 = 0
  if (!isFinite(threeCharactersToCheck[0]) && !isFinite(threeCharactersToCheck[1]) && !isFinite(threeCharactersToCheck[2])) {
    return;
  }

  // 1 0 1 = 2
  if (isFinite(threeCharactersToCheck[0]) && !isFinite(threeCharactersToCheck[1]) && isFinite(threeCharactersToCheck[2])) {
    tuples.push([x-1, y]);
    tuples.push([x+1, y]);
    return;
  }

  // 1 0 0 = 1
  // 1 1 0 = 1
  // 1 1 1 = 1
  if (isFinite(threeCharactersToCheck[0])) {
    tuples.push([x-1, y])
    return;
  }

  // 0 0 1 = 1 
  if (!isFinite(threeCharactersToCheck[1]) && isFinite(threeCharactersToCheck[2])) {
  tuples.push([x+1, y])
  return;
  }

  // 0 1 0 = 1
  // 0 1 1 = 1
  tuples.push([x, y])
}

const getMatchedNumbersRowColumnTuples = (matrix, y, x) => { 
  const tuples = [];
  // line up
  addToTuplesNumbers(tuples, matrix[y-1], x, y-1);
  // current line
  if(isFinite(matrix[y][x-1])) {
    tuples.push([x-1,y]);
  }
  // current line
  if (isFinite(matrix[y][x+1])) {
    tuples.push([x+1,y]);
  }
  // line down
  addToTuplesNumbers(tuples, matrix[y+1], x, y+1);
    
  return tuples;
}

// find all digits of number recursively
const getNumberFromXY = (matrix, x, y, direction) => {
  // quit recursion
  if (isNaN(matrix[y][x])) {
    return "";
  }

  if (direction === "back") {
    return getNumberFromXY(matrix, x-1, y, "back") + matrix[y][x];
  }
  if (direction === "forward") {
    return matrix[y][x] + getNumberFromXY(matrix, x+1, y, "forward");
  }

  return getNumberFromXY(matrix, x-1, y, "back") + matrix[y][x] + getNumberFromXY(matrix, x+1, y, "forward");
}

const calculateEngineValue = (matrix, xyTuples) => {
  if (xyTuples.length !== 2) { 
    return 0;
  }

  let value = 1;
  for (const [x,y] of xyTuples) {
    const num = getNumberFromXY(matrix, x, y);
    value *= Number(num)
  }

  return value;
}

const checkLineAndReturnValidSumOfEngineCharacter = (matrixCache, lineNumber) => {
  let currentLineSum = 0;

  // check line
  let characterIndex = -1;
  for (const character of matrixCache[lineNumber]) {
      characterIndex++;

      if (character === '*') {
        const tuples = getMatchedNumbersRowColumnTuples(matrixCache, lineNumber, characterIndex);
        currentLineSum += calculateEngineValue(matrixCache, tuples);
      }
  }

  return currentLineSum;
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
const inputFile2 = await open('./input.txt');
let totalPoints2 = 0;
{
  let threeRowsMatrixCache = [];
  let lineNumber = -1;
  for await (const line of inputFile2.readLines()) {
    lineNumber++;
    // did anyone say slicing window?
    if (lineNumber > 2) {
      threeRowsMatrixCache = threeRowsMatrixCache.slice(1);
    }
    threeRowsMatrixCache.push(line);
    // check first line - start
    if (lineNumber === 1) {
      totalPoints2 += checkLineAndReturnValidSumOfEngineCharacter(threeRowsMatrixCache, 0);
    }
    // check mid line - slicing!
    if (lineNumber > 1) {
      totalPoints2 += checkLineAndReturnValidSumOfEngineCharacter(threeRowsMatrixCache, 1);
    }
  }
  // check last line - end
  if (lineNumber > 1) {
    totalPoints2 += checkLineAndReturnValidSumOfEngineCharacter(threeRowsMatrixCache, 2);
  }
}

console.log(totalPoints2);

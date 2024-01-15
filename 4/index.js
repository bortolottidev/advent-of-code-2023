import { open } from 'node:fs/promises';

const inputFile = await open('./input.txt');
let totalPoints = 0;

for await (const line of inputFile.readLines()) {
  // read
  let [ winningNumbers, numbers ] = line.split(": ")[1].split(" | ");

  // clean
  winningNumbers = winningNumbers.split(" ").filter(Boolean);
  numbers = numbers.split(" ").filter(Boolean);

  const winningNumbersMap = new Set();
  for (const num of winningNumbers) {
    winningNumbersMap.add(num);
  }

  let partialPoints = 0;
  for (const num of numbers) {
    if(winningNumbersMap.has(num)) {
      partialPoints = partialPoints === 0 ? 1 : (partialPoints * 2);
    }
  }

  totalPoints += partialPoints;
}

console.log(totalPoints);

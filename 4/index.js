import { open } from 'node:fs/promises';

const inputFile = await open('./input.txt');
//let totalPoints = 0;
let totalCards = 0;
let copyCards = [];

for await (const line of inputFile.readLines()) {
  // read
  let [ winningNumbers, numbers ] = line.split(": ")[1].split(" | ");
  const currentCopyCards = copyCards[0] || 0; 
  copyCards = copyCards.slice(1);

  // clean
  winningNumbers = winningNumbers.split(" ").filter(Boolean);
  numbers = numbers.split(" ").filter(Boolean);

  const winningNumbersMap = new Set();
  for (const num of winningNumbers) {
    winningNumbersMap.add(num);
  }

  //let partialPoints = 0;
  let partialIndex = 0;
  const currentCardsNumber = 1 + currentCopyCards;
  for (const num of numbers) {
    if(winningNumbersMap.has(num)) {
      copyCards[partialIndex] = copyCards[partialIndex] ? (copyCards[partialIndex] + currentCardsNumber) : currentCardsNumber;
      partialIndex++;
      //partialPoints = partialPoints === 0 ? 1 : (partialPoints * 2);
    }
  }

  totalCards += currentCardsNumber ;
}

console.log(totalCards);

import { open } from 'node:fs/promises';

const inputFile = await open('./input.txt');
let totalPoints = 0;

for await (const line of inputFile.readLines()) {
	let firstNum = null;
	let lastNum = null;
  for (const character of line) {
	  if (isFinite(character)) {
		firstNum = firstNum ?? character;
		lastNum = character;
	  }
  }

  totalPoints += Number((firstNum + lastNum) ?? 0);
}

console.log(totalPoints);

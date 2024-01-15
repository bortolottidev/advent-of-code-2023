import { open } from 'node:fs/promises';

const inputFile = await open('./input.txt');
let totalPoints = 0;

const digitMapper = {
	'o': { 'n': { 'e': 1 } },
	't': { 
		'w': { 'o': 2 },
		'h': { 'r': { 'e': { 'e': 3 } } },
	},
	'f': { 
		'o': { 'u': { 'r': 4 } },
		'i': { 'v': { 'e': 5 } },
	},
	's': { 
		'i': { 'x': 6 },
		'e': { 'v': { 'e': { 'n': 7 } } },
	},
	'e': { 'i': { 'g': { 'h': { 't': 8 } } } },
	'n': { 'i': { 'n': { 'e': 9 } } },
}


for await (const line of inputFile.readLines()) {
	let firstNum = null;
	let lastNum = null;
	let currentDigitPointers = [];
  for (const character of line) {
	  // go deep in the tree or reset the pointer if nothing is matched
	  if (currentDigitPointers.length > 0) {
		  currentDigitPointers = currentDigitPointers.map(digitPointer => digitPointer[character]).filter(Boolean);
	  }
	  if (digitMapper[character]) {
		  currentDigitPointers.push(digitMapper[character]);
	  }

	  if (isFinite(character)) {
		firstNum = firstNum ?? character;
		lastNum = character;
		// reset character pointers
		currentDigitPointers = [];
	  } 

	  const digitReached = currentDigitPointers.find(digitPointer => isFinite(digitPointer));
	  if (digitReached) {
		firstNum = '' + (firstNum ?? digitReached);
		lastNum = '' + (digitReached);
	  }
  }

  totalPoints += Number(firstNum + lastNum);
}

console.log(totalPoints);

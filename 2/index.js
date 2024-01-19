import { open } from 'node:fs/promises';

const inputFile = await open('./input.txt');
// Determine which games would have been possible if the bag had been loaded with only 12 red cubes, 13 green cubes, and 14 blue cubes. What is the sum of the IDs of those games
const MAX_RED_CUBES = 12;
const MAX_GREEN_CUBES = 13;
const MAX_BLUE_CUBES = 14;
let totalPoints = 0;
let gameId = 0;

//Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
for await (const line of inputFile.readLines()) {
	gameId++;
	let skipCharacters = true;
	const sets = [];
	let startWordIndex = null;
	let currentIndex = -1;
	let currentSet = {};
	let currentColorNumber = null;

	for (const character of line) {
		currentIndex++;
		// skip all characters before :
		if (character === ':') {
			skipCharacters = false;
			continue;
		}
		if (skipCharacters) {
			continue;
		}

		if (character !== ' ' && !startWordIndex) {
			startWordIndex = currentIndex;
		}

		// parse number color and set
		if (character === ';') {
			// set complete
			const color = line.slice(startWordIndex,currentIndex);
			currentSet[color] = currentColorNumber;
			sets.push(currentSet);
			currentSet = {};
			currentColorNumber = null;
		}

		if (character === ' ' && !!startWordIndex) {
			// number complete
			currentColorNumber = Number(line.slice(startWordIndex,currentIndex));
			startWordIndex = null;
		}

		if (character === ',') {
			// word complete
			const color = line.slice(startWordIndex,currentIndex);
			currentSet[color] = currentColorNumber;
			startWordIndex = null;
			currentColorNumber = null;
		}
	}
	const color = line.slice(startWordIndex);
	currentSet[color] = currentColorNumber;
	sets.push(currentSet);

	const isGamePossible = sets.every(set => { 
		return (set.green || 0) <= MAX_GREEN_CUBES
		 && (set.red || 0) <= MAX_RED_CUBES
		 && (set.blue || 0) <= MAX_BLUE_CUBES;
			
	});
	if (isGamePossible) {
		totalPoints += gameId;
	}
}

console.log(totalPoints);

// PART 2
const inputFile2 = await open('./input.txt');
let totalPoints2 = 0;
for await (const line of inputFile2.readLines()) {
	gameId++;
	let skipCharacters = true;
	const sets = [];
	let startWordIndex = null;
	let currentIndex = -1;
	let currentSet = {};
	let currentColorNumber = null;

	for (const character of line) {
		currentIndex++;
		// skip all characters before :
		if (character === ':') {
			skipCharacters = false;
			continue;
		}
		if (skipCharacters) {
			continue;
		}

		if (character !== ' ' && !startWordIndex) {
			startWordIndex = currentIndex;
		}

		// parse number color and set
		if (character === ';') {
			// set complete
			const color = line.slice(startWordIndex,currentIndex);
			currentSet[color] = currentColorNumber;
			sets.push(currentSet);
			currentSet = {};
			currentColorNumber = null;
		}

		if (character === ' ' && !!startWordIndex) {
			// number complete
			currentColorNumber = Number(line.slice(startWordIndex,currentIndex));
			startWordIndex = null;
		}

		if (character === ',') {
			// word complete
			const color = line.slice(startWordIndex,currentIndex);
			currentSet[color] = currentColorNumber;
			startWordIndex = null;
			currentColorNumber = null;
		}
	}
	const color = line.slice(startWordIndex);
	currentSet[color] = currentColorNumber;
	sets.push(currentSet);

  // [RED, GREEN, BLUE]
  const minColorsRequired = [0, 0, 0];
  
	sets.forEach(set => { 
		minColorsRequired[0] = Math.max((set.red || 0), minColorsRequired[0]);
		minColorsRequired[1] = Math.max((set.green || 0), minColorsRequired[1]);
		minColorsRequired[2] = Math.max((set.blue || 0), minColorsRequired[2]);
	});
  totalPoints2 += minColorsRequired[0] * minColorsRequired[1] * minColorsRequired[2];
}

console.log(totalPoints2);

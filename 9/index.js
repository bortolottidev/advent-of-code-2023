import { open } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';

const inputFile = await open('./input.txt');

// save graph
performance.mark("Collect");
const histories = [];
for await (const line of inputFile.readLines()) {
	histories.push(line.split(" ").map(Number));
}
console.log(performance.measure("Collect phase", "Collect"));

function findNextNumber(historySequence) {
	let historySequenceMatrix = new Array(historySequence.length-1);
	let rowIndex = 0;
	let currentRow = historySequence;
	let differInSequence;
	// build differencePyramid (matrix)
	do {
		differInSequence = false;
		historySequenceMatrix[rowIndex] = new Int32Array(historySequence.length -rowIndex );
		for (let i = 0; i < historySequence.length -rowIndex-1; i++) {
			historySequenceMatrix[rowIndex][i] = currentRow[i+1] - currentRow[i];
			if (historySequenceMatrix[rowIndex][i] !== 0) {
				differInSequence = true;
			}
		}
		currentRow = historySequenceMatrix[rowIndex];
		rowIndex++;
		// force exit
		if (rowIndex === historySequenceMatrix.length -1) {
			differInSequence = false;
		}
	} while (differInSequence);
	
	// find last number
	for (let i = rowIndex-2; i >= 0; i--) {
		const startingPoint = historySequenceMatrix[i].length-2;
		const numToSum = historySequenceMatrix[i+1][startingPoint] || 0;
		historySequenceMatrix[i][startingPoint+1] = historySequenceMatrix[i][startingPoint] + numToSum;
	}

	const historySequenceLastNumberDelta = historySequenceMatrix[0][historySequence.length-1];

	// calc next number on initial sequence
	return historySequence[historySequence.length-1] + historySequenceLastNumberDelta;
}

let sum = 0;
performance.mark("Calc");
for (const history of histories) {
	const next = findNextNumber(history);
	console.log({ next })
	sum += next;
}
console.log(performance.measure("Calc phase", "Calc"));
console.log({ total: sum })

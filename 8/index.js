import { open } from 'node:fs/promises';

const inputFile = await open('./input.txt');

const nodeGraph = new Map();
let instructions = null;

// save graph
for await (const line of inputFile.readLines()) {
	if (!instructions) {
		instructions = line.split("")
			.map(directionChar => directionChar === 'L' ? 'left' : 'right')
		continue;
	}
	if (!line) {
		continue;
	}
	const [startNode, directions] = line.split(" = ");
	const [left, right] = directions.slice(1, -1).split(", ");
	nodeGraph.set(startNode, { right, left });
}

// walk!
let currentNode = nodeGraph.get("AAA");
let reachedZZZ = false;
let instructionSequenceIndex = 0;
let step = 0;
while (!reachedZZZ) {
	// where to move?
	const direction = instructions[instructionSequenceIndex % instructions.length];
	instructionSequenceIndex++;
	const nextNode = currentNode[direction];

	// move to the next!
	step++;
	if(nextNode === "ZZZ") {
		reachedZZZ = true;	
		continue;
	}
	currentNode = nodeGraph.get(nextNode);	
}

console.log("Reached ZZZ in " + step + " steps");

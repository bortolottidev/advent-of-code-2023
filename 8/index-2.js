import { open } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { Worker, isMainThread, workerData } from 'node:worker_threads';

const inputFile = await open('./input.txt');

const nodeGraph = new Map();
let instructions = null;
let startingNodes = [];
const nodeEndsWithChar = (nodeName, character) => nodeName[2] === character;

// save graph
performance.mark("Collect");
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
	nodeGraph.set(startNode, { left, right});
	if(nodeEndsWithChar(startNode, "A")) {
		startingNodes.push(startNode);
	}
}
console.log(performance.measure("Collect phase", "Collect"));

// walk!
let collectedAllGhostLoopData = 0;
let instructionSequenceIndex = 0;
let step = 0;
let currentNodes = startingNodes.map(nodeName => nodeGraph.get(nodeName));
let reachedEnd = false;

performance.mark("Walk");
const endLoopData = {
}
while (!collectedAllGhostLoopData) {
	// direction to move for all node
	const direction = instructions[instructionSequenceIndex];
	instructionSequenceIndex++;
	if (instructionSequenceIndex === instructions.length) {
		instructionSequenceIndex = 0;
	}

	// move to the next for every node!
	step++;
	for (let i = 0; i < currentNodes.length; i++) {
		// stop looking for i ghost, we already know his cycle
		if (endLoopData[i] && !!endLoopData[i].delta) { 
			continue;
		}

		const currentNode = currentNodes[i];
		const nextNodeName = currentNode[direction];
		currentNodes[i] = nodeGraph.get(nextNodeName);	

		if(nodeEndsWithChar(nextNodeName, "Z")) {
			if (endLoopData[i]) {
				const delta = step - endLoopData[i].lastReachStep;
				endLoopData[i].delta = delta;
				endLoopData[i].lastReachStep = step;
			} else {
				endLoopData[i] = {
					lastReachStep: step,
					delta: null,
				}
			}
		}
	}

	// should stop?
	if (Object.keys(endLoopData).length === currentNodes.length && Object.values(endLoopData).every(loop => !!loop.delta)) {
		collectedAllGhostLoopData = true;
	}
}

let commonStep = null;
seekForCommonStep: while (true) {
	let minStep = +Infinity, minDelta = null, minKey = null;
	Object.entries(endLoopData).forEach(([k, { lastReachStep, delta }]) => {
		if (lastReachStep < minStep) {
			minStep = lastReachStep;
			minDelta = delta;
			minKey = k;
		}
	});
	endLoopData[minKey].lastReachStep += minDelta;
	const newValueToCheck = endLoopData[minKey].lastReachStep;	
	if(Object.values(endLoopData).every(({ lastReachStep }) => lastReachStep === newValueToCheck)) {
		commonStep = newValueToCheck;
		break seekForCommonStep;
	}
}

console.log(performance.measure("Walk phase", "Walk"));
console.log("REACHED All ZZZ IN " + commonStep + " STEPS");

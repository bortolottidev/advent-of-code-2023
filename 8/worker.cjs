"use strict";

const {
  Worker,
  isMainThread,
  setEnvironmentData,
  getEnvironmentData,
	parentPort,
	workerData,
} = require('node:worker_threads');

const { open } = require('node:fs/promises');
const { performance } = require('node:perf_hooks');

const nodeGraph = new Map();
let instructions = null;
let startingNodes = [];
const nodeEndsWithChar = (nodeName, character) => nodeName[2] === character;

const main = async () => {
	if (isMainThread) {
		const inputFile = await open('./input.txt');

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

		const currentNodes = startingNodes.map(nodeName => nodeGraph.get(nodeName));
		setEnvironmentData('instructions', instructions);
		setEnvironmentData('nodeGraph', nodeGraph);
		setEnvironmentData('currentNodes', currentNodes);

		// run!
		const worker = new Worker(__filename, { workerData: { }});

		// check for happy result
		worker.on("message", (stopStep) => {
			console.log("hooray: " + stopStep);
		});
	} else {
		const instructions = getEnvironmentData('instructions');
		const nodeGraph = getEnvironmentData('nodeGraph');
		const currentNodes = getEnvironmentData('currentNodes');
		let step = 0;
		let instructionSequenceIndex = 0;
		// walk!
		performance.mark("Walk");
		whileAllGhostReachEnd: while (true) {
			// direction to move for all node
			const direction = instructions[instructionSequenceIndex];
			instructionSequenceIndex++;
			if (instructionSequenceIndex === instructions.length) {
				instructionSequenceIndex = 0;
			}

			// move to the next for every node!
			step++;
			let reachedEnd = 0;
			const ns = [];
			for (let i = 0; i < currentNodes.length; i++) {
				const nextNodeName = currentNodes[i][direction];
				const nextNode = nodeGraph.get(nextNodeName);	
				ns.push(nextNodeName);
				currentNodes[i] = nextNode;

				// possible stop
				if(nodeEndsWithChar(nextNodeName, "Z")) {
					reachedEnd++;
				}
			}
			if (reachedEnd === 4){
				parentPort.postMessage(step);
				break whileAllGhostReachEnd;
			}

		}
		console.log(performance.measure("Run phase", "Walk"));
	}

}

main();

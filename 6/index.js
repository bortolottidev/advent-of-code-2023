import { open } from 'node:fs/promises';

const inputFile = await open('./input.txt');

// collect data
let distances, times;

for await (const line of inputFile.readLines()) {
	const [header, ...data] = line.split(" ").filter(Boolean);
	if (header === "Time:") {
		times = data.map(Number);
	}
	if (header === "Distance:") {
		distances = data.map(Number);
	}
}
console.log({ times, distances })

function calculateReachableDistance(holdTime, maxTime) {
	const remainTime = maxTime - holdTime;
	// holdTime = speed
	return remainTime * holdTime;
}

let maxWaysToBeatRecords = 1;

for (let i = 0; i < times.length; i++) {
	const maxTime = times[i], distanceToReach = distances[i];
	// iterate on every input O(SQRT(N)) where N = maxTime
	const increase = Math.floor(Math.sqrt(maxTime));
	let reachedMin = null;

	for (let holdTime = 1; holdTime < maxTime && !reachedMin; holdTime=Math.min(holdTime+increase, maxTime-1)) {
		let reachableDistance = calculateReachableDistance(holdTime, maxTime);
		// REACHED, check last SQRT(N)
		while (reachableDistance > distanceToReach) {
			reachedMin = holdTime;
			holdTime--;
			reachableDistance = calculateReachableDistance(holdTime, maxTime);
		} 
	}

	let reachedMax = null;
	for (let holdTime = maxTime - 1; holdTime > 0 && !reachedMax; holdTime=Math.max(1, holdTime-increase)) {
		let reachableDistance = calculateReachableDistance(holdTime, maxTime);
		// REACHED, check forward SQRT(N)
		while (reachableDistance > distanceToReach) {
			reachedMax = holdTime;
			holdTime++;
			reachableDistance = calculateReachableDistance(holdTime, maxTime);
		} 
	}


	const maxWay = reachedMax - reachedMin + 1;
	maxWaysToBeatRecords *= maxWay;
}

console.log({ maxWaysToBeatRecords })

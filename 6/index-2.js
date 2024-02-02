import { open } from 'node:fs/promises';

const inputFile = await open('./input.txt');

// collect data
let distance, time;

for await (const line of inputFile.readLines()) {
	const [header, ...data] = line.split(" ").filter(Boolean);
	if (header === "Time:") {
		time = Number(data.join(''));
	}
	if (header === "Distance:") {
		distance = Number(data.join(''));
	}
}
console.log({ time, distance })

function calculateReachableDistance(holdTime, maxTime) {
	const remainTime = maxTime - holdTime;
	// holdTime = speed
	return remainTime * holdTime;
}

const maxTime = time, distanceToReach = distance;
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


const maxWaysToBeatRecords = reachedMax - reachedMin + 1;

console.log({ maxWaysToBeatRecords })

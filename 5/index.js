import { open } from 'node:fs/promises';

const inputFile = await open('./input.txt');
let lineNumber = -1;
let currentMap = null;
const seeds = [];

const mapCollection = {
  // seed: {
  //   destination: 'soil',
  //   mapList: [{
  //     from: 1,
  //     to: 10,
  //     dest: 12
  //   }]
  // }
}

// collect data
for await (const line of inputFile.readLines()) {
  lineNumber++;
  if (lineNumber === 0) {
    let seedStart;
    line.split(" ").filter(isFinite).forEach((seed, seedIndex) => {
      // seed start
      if (seedIndex % 2 === 0) {
        seedStart = seed;
        return;
      }

      // seed length
      seeds.push({
        start: Number(seedStart),
        end: Number(seedStart) + Number(seed) -1
      });
    })
    continue;
  }

  const firstCharacter = line[0];

  // empty line
  if (firstCharacter === undefined) {
    currentMap = null;
    continue;
  }

  // defining a map
  if (isNaN(firstCharacter)) {
    const [source, destination] = (line.split(" ")[0]).split("-to-");
    currentMap = source;
    mapCollection[currentMap] = {
      destination,
      mapList: []
    }
  }

  // defining a mapList
  if (isFinite(firstCharacter)) {
    const [destinationStart, sourceStart, length] = line.split(" ");
    mapCollection[currentMap].mapList.push({ 
      destinationStart: Number(destinationStart),
      from: Number(sourceStart),
      to: Number(sourceStart) + Number(length) - 1,
    })
  }
}

// remap till location is reached
let lowestLocation = Infinity;
for (const { start, end } of seeds) {
  console.log("Elaboro interval " + start + " to " + end);

  for (let i = start; i <= end; i++) {
    currentMap = "seed";

    // remap Number till location is reached
    let currentRemappingPlaceNumber = i;
    do {
      const mapper = mapCollection[currentMap]

      const remapPlaceMapper = mapper.mapList.find(remap =>
        remap.from <= currentRemappingPlaceNumber &&
        remap.to >= currentRemappingPlaceNumber
      );
      currentRemappingPlaceNumber = remapPlaceMapper
        ? (currentRemappingPlaceNumber - remapPlaceMapper.from) + remapPlaceMapper.destinationStart
        : currentRemappingPlaceNumber;
      currentMap = mapper.destination === 'location' ? null : mapper.destination;
    } while (currentMap !== null);
    
    if (currentRemappingPlaceNumber < lowestLocation) {
      lowestLocation = currentRemappingPlaceNumber;
    }
  }
}

console.log({ lowestLocation })

import { open } from 'node:fs/promises';

const inputFile = await open('./input.txt');

const cardRank = ["A","K","Q","J","T","9","8","7","6","5","4","3", "2"];

const cardsBidData = [];
for await (const line of inputFile.readLines()) {
	const [cards, bid] = line.split(" ");
	const cardsBidEntry = {
		cards,
		bid: Number(bid),
		type: "unknown",
	}
	const counterMap = {};
	for (const card of cards) {
		counterMap[card] = counterMap[card] ? counterMap[card] + 1 : 1;	
	}

	if (Object.values(counterMap).includes(5)) {
		cardsBidEntry.type = "fiveOfAKind";
		cardsBidEntry.score = 0;
	}
	else if (Object.values(counterMap).includes(4)) {
		cardsBidEntry.type = "fourOfAKind";
		cardsBidEntry.score = 1;
	}
	else if (Object.values(counterMap).includes(3) && Object.values(counterMap).includes(2)) {
		cardsBidEntry.type = "fullHouse";
		cardsBidEntry.score = 2;
	}
	else if (Object.values(counterMap).includes(3)) {
		cardsBidEntry.type = "threeOfAKind";
		cardsBidEntry.score = 3;
	}
	else if (Object.values(counterMap).findIndex(counter => counter === 2) !== Object.values(counterMap).findLastIndex(counter => counter === 2)) {
		cardsBidEntry.type = "twoPair";
		cardsBidEntry.score = 4;
	}
	else if (Object.values(counterMap).includes(2)) {
		cardsBidEntry.type = "pair";
		cardsBidEntry.score = 5;
	} else {
		cardsBidEntry.type = "highCard";
		cardsBidEntry.score = 6;
	}

	cardsBidData.push(cardsBidEntry);
}

// sort by hand score
cardsBidData.sort((hand, hand2) => {
	// sort by type
	if (hand2.score !== hand.score) return hand2.score - hand.score;

	// check card by card
	for (let i = 0; i <= 4; i++) {
		const rankCard = cardRank.indexOf(hand.cards[i]);
		const rankCard2 = cardRank.indexOf(hand2.cards[i]);
		if (rankCard !== rankCard2) {
			return rankCard2 < rankCard ? -1 : 1; 
		}
	}
})

let totalPoints = 0;
// calculate total points
for (let i = 0; i < cardsBidData.length; i++) {
	totalPoints += (i+1) * cardsBidData[i].bid;
}
console.log("HOORAY, points: " + totalPoints);

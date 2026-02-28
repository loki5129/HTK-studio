import * as pos from "./pos.js";

export function bestMove(play, piece,next,weights){
	let moves = pos.allPos(play, piece ,weights);
	let bestobj = null;
	let index = 0

	let score = -Infinity;
	
	for (const move of moves){
	const boardAM = pos.placeMove(play,piece,move)
	if (!boardAM)continue;
const nextMove = pos.allPos(boardAM, next, weights)
const nextBest = nextMove.length > 0 ? Math.max(...nextMove.map(m => m.score)) : 0;
	const total = move.score + nextBest;
	if (total > score) {
            score = total;
            bestobj = move;
	}
	}
	return bestobj; 
}

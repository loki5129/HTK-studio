import * as pos from "./pos.js";

export function bestMove(play, piece,next,weights){
	let moves = pos.allPos(play, piece ,weights);
	//console.log("piece: "+piece.name)
	let bestobj = null;
	let index = 0

	let score = -Infinity;
	
	for (const move of moves){
	const boardAM = pos.placeMove(play,piece,move)
	if (!boardAM){
		//console.log("NO MOVE FOUND FOR: ",piece.name)
		break}
			//continue;
const nextMove = pos.allPos(boardAM.board, next, weights)
	//console.log("next move: "+ nextMove)
	//console.log("move scpre: "+move.score)
const nextBest = nextMove.length > 0 ? Math.max(...nextMove.map(m => m.score)) : 0;
	//console.log("next BEST: " + nextBest)
	const total = move.score + nextBest;
	//console.log("total: "+ total)
	if (total > score) {
            score = total;
            bestobj = move;
	}
	}
	return bestobj; 
}

import * as pos from "./pos.js";

export function bestMove(play, piece,next,held,weights){
	let moves = pos.allPos(play, piece ,weights);
	const heldPiece = (held && held.matrix) ? held : null;
	let hmoves = heldPiece ? pos.allPos(play,heldpiece,weights) : [];
	//console.log("piece: "+piece.name)
	let bestobj = null;
	let hobj = null
		
	let score = -Infinity;
	let scoreh = -Infinity
	for (const move of moves){
	const boardAM = pos.placeMove(play,piece,move)
	if (!boardAM) break;
	const nextMove = pos.allPos(boardAM.board, next, weights)
	const nextBest = nextMove.length > 0 ? Math.max(...nextMove.map(m => m.score)) : 0;
	const total = move.score + nextBest;
	if (total > score){score = total; bestobj = move;}
	}
	for (const move in hmoves){
	const boardAMH = pos.placeMove(play,heldPiece,move);
	if (!boardAMH) break;
	const nextmoveh = pos.allPos(boardAMH.board,next,weights);
	const nextbesth = nextMoveh.lenghth > 0 ? Math.max(...nextMoveh.map(m=> m.score)) : 0;
	const totalh = move.score + nextbesth;
	if (totalh > scoreh){scoreh = totalh; hobj = move}
	}
	return scoreh > score ? { move: hobj, swap: true } : { move: bestobj, swap: false };
}

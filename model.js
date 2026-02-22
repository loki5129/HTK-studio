import * as pos from "./pos.js";
export function bestMove(play, piece){
	let place = pos.allPos(play,piece);
	let index = 0;
	let score = -Infinity;
	for (let i = 0; i<place.length; i++ ){
	if (place[i].score > score){
		score = place[i].score;
		index = i;
		}
	}
return place[index].col; 
}

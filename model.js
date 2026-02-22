import * as pos from "./pos.js";
export function bestMove(play, piece){
	let places = pos.allPos(play,piece);
	index = -1000;
	score = -1000;
	for (let i = 0; i<place[0].length; i++ ){
	if (place[i].score > score){
		score = place[i].score;
		index = i;
		}
	}
return index; 
}

import * as pos from "./pos.js";
export function bestMove(play, piece weights){
	let place = pos.allPos(play,piece,weights);
	let index = 0;
	let score = -Infinity;
	for (let i = 0; i<place.length; i++ ){
	if (place[i].score > score){
		score = place[i].score;
		index = i;
		}
	}
console.log(place[index])
return place[index]; 
}

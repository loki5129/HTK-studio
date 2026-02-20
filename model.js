function bestMove(place){
	let score = place[0].score;
	let index = 0;
	for (let r = 1; r<place.length;r++){
	let tscore = place[r].score;   
	//console.log(tscore);
	if (score<tscore){
		score = tscore;
		index = r
		}
	}
return place[index]  ;
}


function makemove(play,place){
	let gowhere = getMove(place);


}

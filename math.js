//import * as tf from '@tensorflow/tfjs-node'

function getHeights(play){
	const rows = play.length;
  	const cols = play[0].length;
  	const heights = Array(cols).fill(0);
	for (let c= 0; c<cols; c++){
		for (let r=0;r<rows;r++){
			 if (play[r][c] !== 0) {
 				heights[c] = rows - r;
        			break;
		}
	}
    }
return heights
}
function getTotalHeight(play){
	let sum = 0;
	let height =getHeights(play);
	for (let i=0;i<height.length-1;i++){
	sum +=height[i];
	}
	return sum;

}
function getBumps(play){
	let bumps =0;
	let heights = getHeights(play);
	for (let i=0; i<heights.length-1;i++){
		bumps += Math.abs(heights[i]-heights[i+1])
	}
	return bumps;
}
function rowFull(play, row) {
  // Loop through all columns in the given row
  for (let col = 0; col < play[row].length; col++) {
    // If any cell is 0, the row is not full
    if (play[row][col] === 0 || play[row][col] === "0") {
      return false;
    }
  }
  // If we never found a 0, the row is full
  return true;
}

function getComLines(play){
	let lines = 0;
	for (let r=0;r<play.length;r++){
	if (rowFull(play,r)){
		lines++
		}
	}
	return lines;
	}
function getHoles(play) {
	let holes = 0;
	let rows = play.length;
	let cols = play[0].length;
	for (let c = 0; c < cols; c++) {
	let see = false;
	for (let r = 0; r < rows; r++) {
	const cell = play[r][c];
	const empty = cell === 0 || cell === "0";

	if (!empty){
		see = true;
			}else if (see){
			holes++;
			}
		}
	}
return holes}



export function mathness(play){
	let nums = [];
	nums[0] =getTotalHeight(play);
	nums[1] = getComLines(play);
	nums[2] = getHoles(play);
	nums[3] = getBumps(play);
	return nums;
}	



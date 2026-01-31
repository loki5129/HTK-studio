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
export function getTotalHeight(play){
	let sum = 0;
	let height =getHeights(play);
	for (let i=0;i<height.length-1;i++){
	sum +=height[i];
	}
	return sum;

}
export function getBumps(play){
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
    if (play[row][col] === 0) {
      return false;
    }
  }
  // If we never found a 0, the row is full
  return true;
}

export function getComLines(play){
	let lines = 0;
	for (let r=0;r<play.lengthl;r++){
	if (rowFull(play,r)){
		lines++
		}
	}
	return lines;
	}







export function mathness(play){
	let nums = [];
	nums[0] =getTotalHeight(play);
	nums[1] = getComLines(play);
	nums[2] = 0;
	nums[3] = getBumps(play);
	return nums;
}	



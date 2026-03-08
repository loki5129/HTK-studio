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


function getRowTransitions(play) {
    let transitions = 0;
    const rows = play.length;
    const cols = play[0].length;
    for (let r = 0; r < rows; r++) {
        // Left border transition
        if (play[r][0] === 0) transitions++;
        for (let c = 0; c < cols - 1; c++) {
            const curr = play[r][c] !== 0;
            const next = play[r][c + 1] !== 0;
            if (curr !== next) transitions++;
        }
        // Right border transition
        if (play[r][cols - 1] === 0) transitions++;
    }
    return transitions;
}

function getLandingHeight(pie, boardHeight = 20) {
  let bottom = -Infinity;
  //console.log("PIECE: "+pie);
  for (let row = 0; row < pie.matrix.length; row++) {
    for (let col = 0; col < pie.matrix[row].length; col++) {

      if (pie.matrix[row][col]) {

        let absoluteRow = pie.row + row;

        if (absoluteRow > bottom) {
          bottom = absoluteRow;
        }
      }
    }
  }

  return boardHeight - bottom;
}
function getTotalHeight(play){
	let sum = 0;
	let height =getHeights(play);
	for (let i=0;i<height.length;i++){
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

function getCumulativeWells(play) {
    const rows = play.length;
    const cols = play[0].length;
    let total = 0;
    for (let c = 0; c < cols; c++) {
        let depth = 0;
        for (let r = 0; r < rows; r++) {
            const empty = play[r][c] === 0 || play[r][c] === "0";
            const leftWall  = c === 0        || play[r][c - 1] !== 0;
            const rightWall = c === cols - 1 || play[r][c + 1] !== 0;
            if (empty && leftWall && rightWall) {
                depth++;
                total += depth; // cumulative: depth 1=1, 2=1+2, 3=1+2+3...
            } else {
                depth = 0;
            }
        }
    }
    return total;
}
function getColTransitions(play) {
    let transitions = 0;
    const rows = play.length;
    const cols = play[0].length;
    for (let c = 0; c < cols; c++) {
        // Top border transition
        if (play[0][c] === 0) transitions++;
        for (let r = 0; r < rows - 1; r++) {
            const curr = play[r][c] !== 0;
            const next = play[r + 1][c] !== 0;
            if (curr !== next) transitions++;
        }
        // Bottom is always filled (floor)
    }
    return transitions;
}

export function mathness(play, piece=null){
	let nums = [];
	nums[0] =getTotalHeight(play);
	nums[1] = getComLines(play);
	nums[2] = getHoles(play);
	nums[3] = getBumps(play);
	nums[4] = getRowTransitions(play)
	nums[5] = getColTransitions(play)
	nums[6] = getCumulativeWells(play)
	nums[7] = piece ? getLandingHeight(piece) : 0;
	return nums;
}	



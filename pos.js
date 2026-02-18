import * as mathFunctions from './math.js';
function rotate(matrix) {
 	const length = matrix.length;	
	const N = length - 1;
	const result = matrix.map((row,i)=>
	row.map((val,j)=> matrix[N-j][i]));
	return result;
}

function rotations(piece) {
	let rotations = [piece];
//	console.log("roat jkdg "+ rotations[0].length);
for (let i = 1; i < 4; i++) {
    const newRotation = rotate(rotations[i-1]);
    // Only keep unique rotations
 if (!rotations.some(r => JSON.stringify(r) === JSON.stringify(newRotation))) {
        rotations.push(newRotation);}}
return rotations;}
function canmove(matrix, cellRow, cellCol) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] && (
          // outside the game bounds
          cellCol + col < 0 ||
          cellCol + col >= playfield[0].length ||
          cellRow + row >= playfield.length ||
          // collides with another piece
          playfield[cellRow + row][cellCol + col])
        ) {
        return false;
      }
    }
  }

  return true;
}
function drop(matrix,p){
	while(canmove(matrix,p.row +1,p.col)){
		p.row ++;	
	}
	return;

}
export function allPos(pie,play) {
	let placement = []
	let matrix = pie.matrix
//	console.log(pie + "\n");
	//console.log(rotate(pie))
	let rotation = rotations(pie);
//console.log(rotation)
	for ( let r in rotation){
	
	}
}

import {score} from './gen.js';
function rotate(matrix) {
	const length = matrix.length;	
	const N = length - 1;
	const result = matrix.map((row,i)=>
	row.map((val,j)=> matrix[N-j][i]));
	return result;
}
function clone(board) {
  return board.map(row => row.slice());
}
function rotations(piece) {
	let rotations = [piece];
    if (piece.length === 2 && piece[0].length === 2 &&piece.flat().every(v => v)) {
    return rotations;
  }
//	console.log("roat jkdg "+ rotations[0].length);
for (let i = 1; i < 4; i++) {
    const newRotation = rotate(rotations[i-1]);
    // Only keep unique rotations
 if (!rotations.some(r => JSON.stringify(r) === JSON.stringify(newRotation))) {
rotations.push(newRotation);}}
return rotations;
}

function canmove(matrix, cellRow, cellCol, playfield) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col]) {
                const ROW = cellRow + row;
                const COL = cellCol + col;
                if (COL < 0 || COL >= playfield[0].length) return false;
                if (ROW >= playfield.length) return false;
                if (ROW < 0) continue;
                if (playfield[ROW][COL]) return false;
            }
        }
    }
    return true;
}

function placeSim(piece, board) {
    for (let row = 0; row < piece.matrix.length; row++) {
        for (let col = 0; col < piece.matrix[row].length; col++) {
            if (piece.matrix[row][col]) {
		const r = piece.row + row;
		const c = piece.col + col;
		if (r < 0) continue;
                board[r][c] = piece.name;
            }
        }
    }
}
export function placeMove(play,piece,move){
	let cloned = clone(play);
	const allRotations = rotations(piece.matrix);
    	const rotatedMatrix = allRotations[move.rotation];
	const testPiece = {
        name: piece.name,
        matrix: rotatedMatrix,
        row: -2,
        col: move.col};
if (!canmove(testPiece.matrix, testPiece.row, testPiece.col, cloned)) {
        return null; // invalid move
    }
while (canmove(testPiece.matrix,
	testPiece.row+1,
	testPiece.col,
	cloned
	)){
	testPiece.row++;
}
	placeSim(testPiece, cloned);
	clearLinesSim(cloned)
	return cloned
}
function clearLinesSim(board) {
    for (let r = board.length - 1; r >= 0; r--) {
        if (board[r].every(cell => cell !== 0)) {
            for (let rr = r; rr > 0; rr--) {
                board[rr] = [...board[rr - 1]];
            }
            board[0] = Array(board[0].length).fill(0);
            r++; // recheck same row after shift
        }
    }
}
export function allPos(play,pie,weights) {
	let placement = []
	const allrot =  rotations(pie.matrix);



for ( let r=0; r < allrot.length; r++){
	
		let rotated = allrot[r];
		for (let col =0;
		col <= play[0].length - rotated[0].length;
		col++){
		let clonedeck = clone(play);
		const newBoard = placeMove(play, pie, {
                rotation: r,
                col: col});
		if (!newBoard) continue;
		const Tscore = score(newBoard,weights);
		     placement.push({
		     rotation: r,
		     col: col,
		     score: Tscore
		});
	}
      }
	return placement;
			}


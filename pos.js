import * as mathFunctions from './math.js';
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
return rotations;}

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
export function allPos(play,pie) {
	let placement = []
	let matrix = pie.matrix
//	console.log(pie + "\n");
	//console.log(rotate(pie))
	let rotation = rotations(matrix);
//console.log(rotation)
	for ( let r=0; r < rotation.length; r++){
	let rotated = rotation[r];
	
for (let col =0; col <= play[0].length - rotated[0].length;col++){
		let clonedeck = clone(play);
		      let testPiece = {
			name: pie.name,
			matrix: rotated,
			row: -2,
			col: col
			}
if (!canmove(testPiece.matrix, testPiece.row, testPiece.col, clonedeck)) {continue;
      }

      // drop piece
      while (canmove(testPiece.matrix, testPiece.row + 1, testPiece.col, clonedeck)) {
        testPiece.row++;
      }
	placeSim(testPiece, clonedeck);
		let score = mathFunctions.score(clonedeck);
		     placement.push({
		     rotation: r,
		     col: col,
		     score: score
      });
		//console.log(score);
		}
	}
	return placement;
			}


import {bestMove} from "model.js";
//this fucntion generates a random int between the parameters 




function randint(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
//
// this code generates a sequneunne of the peices 
function genS(){
    const seq =  ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
     while (seq.length) {
    const rand = randint(0, seq.length - 1);
    const name = seq.splice(rand, 1)[0];
    tseq.push(name);
  }
}
//



//this function gets the next piece from the sequnce and makes it into the proper martix so it be used
function nextpiece(){
    if (tseq.length ==0){
        genS();
    }
    const name = tseq.pop();
    const matrix = tetrominos[name];
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

    // I starts on row 21 (-1), all others start on row 22 (-2)
    const row = 0   
    return {
        name: name,      // name of the piece (L, O, etc.)
        matrix: matrix,  // the current rotation matrix
        row: row,        // current row (starts offscreen)
        col: col         // current col
  };
}
//

//checks if the piece is not obcute
function canmove(matrix, cellRow, cellCol) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col]){
	 const r = cellRow + row;
	 const c = cellCol + col;
          if (c < 0 || c >= playfield[0].length) return false;
        // vertical bounds
        if (r >= playfield.length) return false;

        // collision only if inside visible grid
        if (r >= 0 && playfield[r][c]) return false;
      }
    }
  }

  return true;
}
//


// shapes
const tetrominos = {
  'I': [
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ],
  'J': [
    [1,0,0],
    [1,1,1],
    [0,0,0],
  ],
  'L': [
    [0,0,1],
    [1,1,1],
    [0,0,0],
  ],
  'O': [
    [1,1],
    [1,1],
  ],
  'S': [
    [0,1,1],
    [1,1,0],
    [0,0,0],
  ],
  'Z': [
    [1,1,0],
    [0,1,1],
    [0,0,0],
  ],
  'T': [
    [0,1,0],
    [1,1,1],
    [0,0,0],
  ]
};


function drop(matrix,tetrimono){
	while(canmove(matrix,tetrimono.row +1,tetrimono.col)){
		tetrimono.row ++;
		
	}
	return;

}




function piece(width, height,color,x,y){

  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;

  this.update = function(){
}
function place(){
    for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {
	const r = tetromino.row+row;
	const c = tetromino.col+col;
	if (r < 0) continue;
	playfield[r][c] = tetromino.name;
       }
    }
  }
  for (let row=playfield.length-1; row >=0; row--){
	if (playfield[row].every((cell) => !!cell)) {
	for (let r = row; r > 0; r--){
		playfield[r] = [...playfield[r-1]];
	}
	playfield[0] = Array(playfield[0].length).fill(0);
        lines++
	score += 100
	row++
	}
      }
      tetromino = nextpiece();

});
  for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {
        const r = tetromino.row + row;
        const c = tetromino.col + col;
        if (r >= 0 && playfield[r][c]) {return;}
	}
      }
    }
}


	


  

function rotate(matrix) {
	const N = matrix.length - 1;
	const result = matrix.map((row,i)=>
	row.map((val,j)=> matrix[N-j][i]));
	return result;
}
const hidden = 2;
const vis = 20;
const columns = 10;
const playfield = [];
// hidden rows first (TOP)
for (let i = 0; i < hidden; i++) {
  playfield.push(Array(columns).fill(0));
}

// then visible rows
for (let i = 0; i < vis; i++) {
  playfield.push(Array(columns).fill(0));
}

function resetBoard(){
	playfield = [];
	// hidden rows first (TOP)
for (let i = 0; i < hidden; i++) {playfield.push(Array(columns).fill(0));}

// then visible rows
for (let i = 0; i < vis; i++) {playfield.push(Array(columns).fill(0));}
}
unction makeMove(piece, move) {
    // 1️⃣ Apply rotations
    for (let i = 0; i < move.rotation; i++) {
        const rotated = rotate(piece.matrix);
        if (canmove(rotated, piece.row, piece.col)) {
            piece.matrix = rotated;
        }
    }

    // 2️⃣ Move piece horizontally to target column
    piece.col = move.column;

    // 3️⃣ Drop piece instantly
    while (canmove(piece.matrix, piece.row + 1, piece.col)) {
        piece.row++;
    }
}

	
export function runGame(weights) {

    resetBoard();
    lines = 0;
    score = 0;
    gameover = false;

    while (!gameover) {

        let piece = nextpiece();

        let move = bestMove(playfield, piece, weights);

        applyMove(piece, move);

        

        place()            }

    return {
        lines: lines,
        score: score
    };
}

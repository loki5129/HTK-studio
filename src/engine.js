import {bestMove} from "./model.js";
//this fucntion generates a random int between the parameters 



const MAXPIECE = 500;
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
    const matrix = tetrominos[name].map(r => [...r]);
    const col = Math.floor(playfield[0].length / 2 - Math.ceil(matrix[0].length / 2));

    // I starts on row 21 (-1), all others start on row 22 (-2)
    const row = -2  
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
}}



  

function rotate(matrix) {
	const N = matrix.length - 1;
	const result = matrix.map((row,i)=>
	row.map((val,j)=> matrix[N-j][i]));
	return result;
}

let playfield = []
let tseq = []
const hidden = 2;
const vis = 20;
const columns = 10;
function initPlayfield() {
    playfield = [];
    tseq = []
    for (let i = 0; i < hidden + vis; i++) {
        playfield.push(Array(columns).fill(0));
    }
}
function makeMove(piece, move) {
    //console.log(move) 
    for (let i = 0; i < move.rotation; i++) {
        const rotated = rotate(piece.matrix);
        if (canmove(rotated, piece.row, piece.col)) {
            piece.matrix = rotated;
        }
    }

       piece.col = move.col;

    
    while (canmove(piece.matrix, piece.row + 1, piece.col)) {
        piece.row++;
    }
}

function placePiece(piece,linesobj){
    for(let r=0;r<piece.matrix.length;r++){
        for(let c=0;c<piece.matrix[r].length;c++){
            if(piece.matrix[r][c]){
                const pr = piece.row+r;
                const pc = piece.col+c;
                if(pr>=0 && pr < playfield.length && pc >= 0 && pc < playfield[0].length){
	playfield[pr][pc] = piece.name;
	 }
        }
    }
}

    // Clear lines
    for(let r=playfield.length-1;r>=0;r--){
        if(playfield[r].every(cell=>cell!==0)){
            for(let rr=r;rr>0;rr--) {
	  playfield[rr]=[...playfield[rr-1]]
	    };
            playfield[0]=Array(columns).fill(0);
            linesobj.lines++;
            linesobj.score +=100 
            r++; // recheck this row after shifting
        }
    }
}


function Hold(piece, state) {  // state = { hpiece, canhold }
    if (!state.canhold) return { piece, state };
    state.canhold = false;
    if (state.hpiece === '') {
        state.hpiece = piece.name;
        return { piece: nextpiece(state), state };
    } else {
        const temp = state.hpiece;
        state.hpiece = piece.name;
        const matrix = tetrominos[temp].map(r => [...r]);
        const col = Math.floor(playfield[0].length / 2 - Math.ceil(matrix[0].length / 2));
        return { piece: { name: temp, matrix, row: -2, col }, state };
    }
}
function peekNext() {
    if (tseq.length === 0) genS();
    return tseq[tseq.length - 1];
}

export function runGame(weights){
       initPlayfield();
    let linesobj = {lines:0,score:0};
    let gameover = false;
    let piececount =0; 
    let state = {hpiece: "",canhold:true}
      while (!gameover && piececount!=MAXPIECE) {
	let piece = nextpiece();
	piececount++
	state.canhold = true
	if (state.hpiece === ""){
		({piece,state} =Hold(piece,state))
		}
	 const held = state.hpiece !=="" ? {
            name: state.hpiece,
            matrix: tetrominos[state.hpiece].map(r => [...r]),
            row: -2,
            col: Math.floor(playfield[0].length / 2 - Math.ceil(tetrominos[state.hpiece][0].length / 2))
        } : null;
	const nextName = peekNext()
  const nextPiece = {
    name: nextName,
    matrix: tetrominos[nextName].map(r => [...r]),
    row: -2,
    col: Math.floor(playfield[0].length / 2 - Math.ceil(tetrominos[nextName][0].length / 2))
};
//console.log("HELD: " + held)
//console.log("NEXT: " + nextPiece)
	let obj = bestMove(playfield, piece,nextPiece,held, weights);
	let move = obj.move
	let swap = obj.swap
	if (swap){
		 ({ piece, state } = Hold(piece, state));}
	
	//console.log("MOVE:", move);	
        makeMove(piece, move);
	placePiece(piece,linesobj)
	//console.log(playfield.map(r => r.join("")).join("\n"));
	//console.log("------");
	//console.log(playfield)
	for(let r=0;r<piece.matrix.length;r++){
            for(let c=0;c<piece.matrix[r].length;c++){
                if(piece.matrix[r][c] && piece.row+r<0){
                    gameover=true;
                }
            }
        }
    }

    return linesobj
}


//this fucntion generates a random int between the parameters 

function drawCheck(){
    
    context.beginPath();
    for (var x = 0; x <= bw; x += 32) {
        context.moveTo(0.5 + x,0);
        context.lineTo(0.5 + x , bh );
    }

    for (var x = 0; x <= bh; x += 32) {
        context.moveTo(0, 0.5 + x );
        context.lineTo(bw , 0.5 + x);
    }
    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.stroke();
}


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
//

//colours for shapes
const colors = {
  'I': 'cyan',
  'O': 'yellow',
  'T': 'purple',
  'S': 'green',
  'Z': 'red',
  'J': 'blue',
  'L': 'orange'
};

//

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
  ctx = box.context;
  ctx.fillStyle = color;
  ctx.fillRect(this.x, this.y, this.width, this.height);}

}
function showGameOver(){
	  cancelAnimationFrame(rf);
  gameOver = true;

  context.fillStyle = 'black';
  context.globalAlpha = 0.75;
  context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);

  context.globalAlpha = 1;
  context.fillStyle = 'white';
  context.font = '36px monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
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
        score +=100;
	row++
	}
      }
      tetromino = nextpiece();
	  
  for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {
        const r = tetromino.row + row;
        const c = tetromino.col + col;
        if (r >= 0 && playfield[r][c]) {
          showGameOver();
          return;}
	}
      }
    }
}


	 


  


let count =0
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
var bw = canvas.width;
var bh = canvas.height;

const grid = 32;
const tseq = [];
let gameover=false;
let score = 0;
let rf = null;  // keep track of the animation frame so we can cancel it
function rotate(matrix) {
	const N = matrix.length - 1;
	const result = matrix.map((row,i)=>
	row.map((val,j)=> matrix[N-j][i]));
	return result;
}

const hidden = 2;
const vis = 20;
const columns = 10;
const playfield = Array.from({ length: vis + hidden}, ()=>
	Array(columns).fill(0)
);
let tetromino = nextpiece();

async function sendPlayfield(play,piece){
	const res = await fetch("/analyze", {
    	method: "POST",
   	 headers: { "Content-Type": "application/json" },
    	body: JSON.stringify({
			playfield: play, piece: piece})});
  //const analysis = await res.json();
    const text = await res.json();
  return text; 
}

 function makeMove(col, piece) {
	while (col < piece.col && canmove(piece.matrix, piece.row,piece.col)){
		piece.col--
	}
	while (col > piece.col && canmove(piece.matrix,piece.row,piece.col)){
		piece.col++
	}
}

function gameloop(){
   // console.log(score);
  rf = requestAnimationFrame(gameloop);
  context.clearRect(0,0,canvas.width,canvas.height);
  drawCheck();

  // draw the playfield
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 10; col++) {
      if (playfield[row][col]) {
        const name = playfield[row][col];
        context.fillStyle = colors[name];
        context.fillRect(col * grid, row * grid, grid-1, grid-1);}
      }
    }
   
  if (tetromino){
    if (++count > 35){
      
      tetromino.row++
      count=0;
       if (!canmove(tetromino.matrix, tetromino.row, tetromino.col)) {
        tetromino.row--;
        place();
      }
    }
   sendPlayfield(playfield,tetromino).then(data =>{
   if (data.move !== undefined){
   	makeMove(data.move,tetromino)
	drop(tetromino.matrix,tetromino)
	}
	})
    context.fillStyle = colors[tetromino.name];

for (let row = 0; row < tetromino.matrix.length; row++) {
for (let col = 0; col < tetromino.matrix[row].length; col++) {
if (tetromino.matrix[row][col]) {
// drawing 1 px smaller than the grid creates a grid effect
context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-1, grid-1);
        }
      }
    }    
  }
}
document.addEventListener('keydown', function(e) {
       if (gameover) return;
  // left and right arrow keys (move)
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    const col = e.key === "ArrowLeft"
      ? tetromino.col - 1
      : tetromino.col + 1;

    if (canmove(tetromino.matrix, tetromino.row, col)) {
      tetromino.col = col;
    }
  }
  if (e.key === "ArrowUp"){
	const matrix = rotate(tetromino.matrix);
	if (canmove(matrix,tetromino.row,tetromino.col)){
		tetromino.matrix = matrix;
		}
	}
  if (e.key === " "){
	drop(tetromino.matrix,tetromino);	
	}
  if(e.key === "ArrowDown") {
    const row = tetromino.row + 1;

    if (!canmove(tetromino.matrix, row, tetromino.col)) {	
      tetromino.row = row - 1;

      place();
      return;
    }
    tetromino.row = row;
    	}
    });
	

rf = requestAnimationFrame(gameloop); 

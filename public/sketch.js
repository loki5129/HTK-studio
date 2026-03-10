//this function generates a random int between the parameters 


function drawCheck() {
  context.save();
  context.beginPath();

  for (let x = 0; x <= bw; x += 32) {
    context.moveTo(0.5 + x, 0);
    context.lineTo(0.5 + x, bh);
  }
  for (let y = 0; y <= bh; y += 32) {
    context.moveTo(0, 0.5 + y);
    context.lineTo(bw, 0.5 + y);
  }

  context.strokeStyle = 'rgba(40, 120, 255, 0.22)';
  context.lineWidth = 1;
  context.shadowColor = 'rgba(40, 120, 255, 0.25)';
  context.shadowBlur = 2;
  context.stroke();
  context.restore();
}

function drawBackground() {
  const g = context.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, '#061329');
  g.addColorStop(1, '#0a1f45');
  context.fillStyle = g;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function randint(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// this code generates a sequneunne of the peices 
function genS(){
    const seq =  ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
     while (seq.length) {
    const rand = randint(0, seq.length - 1);
    const name = seq.splice(rand, 1)[0];
    tseq.push(name);
  }
}



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


//colours for shapes
const colors = {
  'I': '#00ffff',
  'O': '#ffd800',
  'T': '#cc00ff',
  'S': '#00ff66',
  'Z': '#ff0033',
  'J': '#0066ff',
  'L': '#ff8800'
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
  ctx = box.context;
  ctx.fillStyle = color;
  ctx.fillRect(this.x, this.y, this.width, this.height);}

}
function showGameOver(){
	    gameover = true;

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
let cleared = 0;

for (let row = playfield.length - 1; row >= 0; row--) {
    if (playfield[row].every(cell => !!cell)) {
        cleared++;

        for (let r = row; r > 0; r--) {
            playfield[r] = [...playfield[r - 1]];
        }
        playfield[0] = Array(playfield[0].length).fill(0);

        row++; 
    }
}

// Base scoring
let points = 0;
if (cleared === 1) points = 100;
else if (cleared === 2) points = 300;
else if (cleared === 3) points = 500;
else if (cleared === 4) points = 800;


points *= level;
score += points;
lines += cleared;

document.getElementById("score-value-model").innerText = score;

console.log("Score:", score, "Lines:", lines);
      tetromino = nextpiece();
 sendPlayfield(playfield, tetromino, nextpiece()).then(data => {
  if (data.move !== undefined) {
    makeMove(data.move, tetromino);
  }
}); 
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
const canvas = document.getElementById('model');
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
const playfield = [];

// hidden rows first (TOP)
for (let i = 0; i < hidden; i++) {
  playfield.push(Array(columns).fill(0));
}

// then visible rows
for (let i = 0; i < vis; i++) {
  playfield.push(Array(columns).fill(0));
}
let tetromino = nextpiece();
let hp = hold(tetromino);
tetromino = hp.piece;
async function sendPlayfield(play,piece,next){
	const res = await fetch("/analyze", {
    	method: "POST",
   	 headers: { "Content-Type": "application/json" },
    	body: JSON.stringify({
			playfield: play, piece: piece, next: next})});
  //const analysis = await res.json();
    const text = await res.json();
	
  return text; 
}

 function makeMove(move, piece) {
	let col = move.col;
	let r = move.rotation;
	for (let s = 0; s < r; s++){
	const rotated = rotate(piece.matrix);
	if (canmove(rotated, piece.row, piece.col)) {
      piece.matrix = rotated;
	}}
while (col < piece.col && canmove(piece.matrix, piece.row,piece.col-1)){
		piece.col--
	}
	while (col > piece.col && canmove(piece.matrix,piece.row,piece.col-1)){
		piece.col++
	}
}

let level = 1;
let lines = 0;
let lastTime = 0;          
let dropCount = 0;       
let dropI = 800;   

function drawBlock(x, y, color) {
    // Base
    context.fillStyle = color;
    context.fillRect(x, y, grid - 1, grid - 1);

    // Top + left highlight
    context.fillStyle = "rgba(255,255,255,0.25)";
    context.fillRect(x, y, grid - 1, 4);
    context.fillRect(x, y, 4, grid - 1);

    // Bottom + right shadow
    context.fillStyle = "rgba(0,0,0,0.35)";
    context.fillRect(x, y + grid - 5, grid - 1, 4);
    context.fillRect(x + grid - 5, y, 4, grid - 1);
}

function getGhostPosition(piece) {
    let ghostRow = piece.row;

    while (canmove(piece.matrix, ghostRow + 1, piece.col)) {
        ghostRow++;
    }

    return ghostRow;
}

function hold(piece){
	let heldPiece = piece;
	piece = nextpiece()
	return {piece:piece, held: heldPiece}
}
function swap(dict){
	return {piece: dict.held, held: dict.piece}
}
function gameloop(){
   // console.log(score);
   if (gameover){
	showGameOver();
	return
	}
    rf = requestAnimationFrame(gameloop);
    
    const currentT = Date.now()
    const deltaTime = currentT - lastTime
    lastTime = currentT
    dropCount += deltaTime
    level = Math.floor(lines / 10) +1;

    const baseTime = 800;
    const minTime = 100;
    dropI = Math.max(baseTime * Math.pow(0.9, level - 1),minTime);

 


if (dropCount > dropI) {
        tetromino.row++;
	dropCount = 0;

        if (!canmove(tetromino.matrix, tetromino.row, tetromino.col)) {
            tetromino.row--;
            place();
        }
    }





  context.clearRect(0,0,canvas.width,canvas.height);
  drawBackground();
  drawCheck();

  // Ghost Piece
const ghostRow = getGhostPosition(tetromino);

context.save();
context.globalAlpha = 0.10;     
context.shadowBlur = 10;           
context.shadowColor = colors[tetromino.name];

for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {
            drawBlock(
                (tetromino.col + col) * grid,
                (ghostRow + row - hidden) * grid,
                colors[tetromino.name]
            );
        }
    }
}

context.restore();

  for (let row = hidden; row < hidden + vis; row++) {
        for (let col = 0; col < columns; col++) {
            if (playfield[row][col]) {
                const name = playfield[row][col];
                drawBlock(
                  col * grid,
                  (row - hidden) * grid,
                  colors[name]
                );
            }
        }
    }

  
    context.fillStyle = colors[tetromino.name];

for (let row = 0; row < tetromino.matrix.length; row++) {
for (let col = 0; col < tetromino.matrix[row].length; col++) {
if (tetromino.matrix[row][col]) {
drawBlock(
    (tetromino.col + col) * grid,
    (tetromino.row + row - hidden) * grid,
    colors[tetromino.name]
);
        }
      }
    } 
       
  }
	

rf = requestAnimationFrame(gameloop); 

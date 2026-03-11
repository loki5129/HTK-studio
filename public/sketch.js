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
    initializePreview();
    const name = previewQueue.shift();
    refillBagIfNeeded()
    previewQueue.push(tseq.pop())
    updatePreview()
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
if (cleared > 0){
	combo ++;
	if (combo >1){
		const comboBonus = 50 * combo * level
		points +=comboBonus
		}
	}else{combo = 0}
score += points;
lines += cleared;

 
 if (cleared > 0 ){
	const scoreEl = document.getElementById("score-value-model");
	scoreEl.classList.remove("score-pulse-model");
	void scoreEl.offsetWidth
	scoreEl.classList.add("score-pulse-model");
	showClearText(cleared,combo)
	}
 document.getElementById("score-value-model").innerText = score;
 document.getElementById("lines-value-model").innerText = lines;
 
 tetromino = nextpiece();
 //sendPlayfield(playfield, tetromino, nextpiece()).then(data => {
  //if (data.move !== undefined) {
   // makeMove(data.move, tetromino);
  //}
//}); 
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
let paused = false;
const previewQueue = []
const PREVIEW_COUNT = 3

let score = 0;
let combo =0;
let rf = null; // keep track of the animation frame so we can cancel it
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

let tetromino = null;

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

let clearAnim = null
let comboAnim = null

function showClearText(cleared, currentCombo) {
    const labels = { 1: 'SINGLE', 2: 'DOUBLE', 3: 'TRIPLE', 4: 'TETRIS!' };
    const colorsMap = { 1: '#ffffff', 2: '#00ff66', 3: '#ff8800', 4: '#00ffff' };
    clearAnim = {
        text: labels[cleared],
        color: colorsMap[cleared],
        alpha: 1.0,
        y: canvas.height / 2,
        timer: 0,
        duration: cleared === 4 ? 90 : 60
    };

    // Show combo badge when combo reaches 2+
    if (currentCombo >= 2) {
        comboAnim = {
            text: `${currentCombo}x COMBO`,
            color: '#ffdd00',
            alpha: 1.0,
            y: canvas.height / 2 + 50,
            timer: 0,
            duration: 80
        };
    }
}

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

function drawMiniPiece(canvas, name) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!name) return;

    const matrix = tetrominos[name];
    const color = colors[name];

    const cell = Math.floor(canvas.width / 3.6); //small piece size

    
    let minR = 0, minC = 0, maxR = 0, maxC = 0;
    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
            if (matrix[r][c]) {
                maxR = r;
                maxC = c;
            }
        }
    }

    // Center
    const pieceW = (maxC + 1 - minC) * cell;
    const pieceH = (maxR + 1 - minR) * cell;

    const offsetX = (canvas.width - pieceW) / 2;
    const offsetY = (canvas.height - pieceH) / 2;

    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
            if (matrix[r][c]) {
                ctx.fillStyle = color;
                ctx.fillRect(
                    offsetX + c * cell,
                    offsetY + r * cell,
                    cell - 1,
                    cell - 1
                );
            }
        }
    }
}

function refillBagIfNeeded() {
    if (tseq.length === 0) genS();
}

function initializePreview() {
    refillBagIfNeeded();

    while (previewQueue.length < PREVIEW_COUNT) {
        refillBagIfNeeded();
        previewQueue.push(tseq.pop());
    }

    updatePreview();
}

function updatePreview() {
    for (let i = 0; i < PREVIEW_COUNT; i++) {
        const canvas = document.getElementById(`next-${i}-model`);
        drawMiniPiece(canvas, previewQueue[i]);
    }
}







function gameloop(){
   

    rf = requestAnimationFrame(gameloop);
    if (!paused && !gameover){ 
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
  }else if (gameover){}





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
    if (clearAnim) {
    clearAnim.timer++;
    clearAnim.y -= 0.5;
    if (clearAnim.timer > clearAnim.duration - 20) {
        clearAnim.alpha = (clearAnim.duration - clearAnim.timer) / 20;
    }

    context.save();
    context.globalAlpha = Math.max(0, clearAnim.alpha);
    context.font = `bold ${clearAnim.text === 'TETRIS!' ? '48' : '36'}px monospace`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    context.shadowColor = clearAnim.color;
    context.shadowBlur = 20;
    context.fillStyle = clearAnim.color;
    context.fillText(clearAnim.text, canvas.width / 2, clearAnim.y);

    if (clearAnim.text === 'TETRIS!') {
        context.shadowBlur = 40;
        context.fillText(clearAnim.text, canvas.width / 2, clearAnim.y);
    }

    context.restore();

    if (clearAnim.timer >= clearAnim.duration) clearAnim = null;
  }

  // Combo animation — shown below the clear text
  if (comboAnim) {
    comboAnim.timer++;
    comboAnim.y -= 0.4;
    if (comboAnim.timer > comboAnim.duration - 20) {
      comboAnim.alpha = (comboAnim.duration - comboAnim.timer) / 20;
    }

    context.save();
    context.globalAlpha = Math.max(0, comboAnim.alpha);
    context.font = 'bold 28px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.shadowColor = comboAnim.color;
    context.shadowBlur = 18;
    context.fillStyle = comboAnim.color;
    context.fillText(comboAnim.text, canvas.width / 2, comboAnim.y);
    context.restore();

    if (comboAnim.timer >= comboAnim.duration) comboAnim = null;
  }
    // Combo counter badge (persistent while combo is active)
  if (combo >= 2) {
    context.save();
    context.font = 'bold 14px monospace';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillStyle = 'rgba(0,0,0,0.55)';
    context.fillRect(6, 6, 110, 26);
    context.fillStyle = '#ffdd00';
    context.shadowColor = '#ffdd00';
    context.shadowBlur = 10;
    context.fillText(`COMBO x${combo}`, 12, 12);
    context.restore();
  }
  if (gameover) {
    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
  } else if (paused) {
    context.save();
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#ffffff';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    context.restore();
  }
}
// Toggle pause with button 
const pauseBtn = document.getElementById("pause-btn");
if (pauseBtn) {
  pauseBtn.addEventListener("click", () => {
    paused = !paused;
    pauseBtn.innerText = paused ? "Resume" : "Pause";
    if (!paused) {
      lastTime = Date.now(); 
    }
  });
}
document.addEventListener('DOMContentLoaded', () => {
	initializePreview();
        tetromino = nextpiece();
	lastTime = Date.now();
	rf = requestAnimationFrame(gameloop);
})
function scaleToFit() {
    const wrapper = document.getElementById('game-wrapper');
    const availableH = window.innerHeight * 0.95;
    const wrapperH = wrapper.scrollHeight;
    const scale = Math.min(1, availableH / wrapperH);
    wrapper.style.transform = `scale(${scale})`;
}

scaleToFit()



window.addEventListener('resize', scaleToFit);	



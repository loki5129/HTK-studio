let countp = 0
const canvasp = document.getElementById('playable');
const contextp = canvasp.getContext('2d');
var bwp = canvasp.width;
var bhp = canvasp.height;
let gameoverp = false
let scorep = 0 
let rfp = null
let tseqp = []
let gridp = 32
const playfieldp = []
const hiddenp = 2
const visp = 20
const columnsp = 10
const PREVIEW_COUNTp = 3;
const previewQueuep = [];
let clearAnimp = null
let comboAnimp =null
let combop = 0
for (let i = 0; i < hiddenp; i++) {
  playfieldp.push(Array(columnsp).fill(0));
}

for (let i = 0; i < visp; i++) {
  playfieldp.push(Array(columnsp).fill(0));
}

let tetrominop = null
function drawCheckp() {
  contextp.save();
  contextp.beginPath();

  for (let x = 0; x <= bwp; x += 32) {
    contextp.moveTo(0.5 + x, 0);
    contextp.lineTo(0.5 + x, bhp);
  }
  for (let y = 0; y <= bhp; y += 32) {
    contextp.moveTo(0, 0.5 + y);
    contextp.lineTo(bwp, 0.5 + y);
  }

  contextp.strokeStyle = 'rgba(40, 120, 255, 0.22)';
  contextp.lineWidth = 1;
  contextp.shadowColor = 'rgba(40, 120, 255, 0.25)';
  contextp.shadowBlur = 2;
  contextp.stroke();
  contextp.restore();
}

function drawBackgroundp() {
  const g = contextp.createLinearGradient(0, 0, 0, canvasp.height);
  g.addColorStop(0, '#061329');
  g.addColorStop(1, '#0a1f45');
  contextp.fillStyle = g;
  contextp.fillRect(0, 0, canvasp.width, canvasp.height);
}

function randint(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// this code generates a sequneunne of the peices 
function genSp(){
    const seq =  ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
     while (seq.length) {
    const rand = randint(0, seq.length - 1);
    const name = seq.splice(rand, 1)[0];
    tseqp.push(name);
  }
}



//this function gets the next piece from the sequnce and makes it into the proper martix so it be used
function nextpiecep(){
	initializePreviewp()
	const name = previewQueuep.shift()
	refillBagIfNeededp()
	previewQueuep.push(tseqp.pop())
	updatePreviewp()
	const matrix = tetrominos[name];
const col = playfieldp[0].length / 2 - Math.ceil(matrix[0].length / 2);

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
function canmovep(matrix, cellRow, cellCol) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col]){
	 const r = cellRow + row;
	 const c = cellCol + col;
          if (c < 0 || c >= playfieldp[0].length) return false;
        // vertical bounds
        if (r >= playfieldp.length) return false;

        // collision only if inside visible grid
        if (r >= 0 && playfieldp[r][c]) return false;
      }
    }
  }

  return true;
}


function dropp(matrix,tetrimono){
	while(canmovep(matrix,tetrimono.row +1,tetrimono.col)){
		tetrimono.row ++;
		
	}
	return;

}




function piecep(width, height,color,x,y){

  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;

  this.update = function(){
  ctx = box.context;
  ctx.fillStyle = color;
  ctx.fillRect(this.x, this.y, this.width, this.height);}

}
function showGameOverp(){
	   gameoverp = true;

  contextp.fillStyle = 'black';
  contextp.globalAlpha = 0.75;
  contextp.fillRect(0, canvasp.height / 2 - 30, canvasp.width, 60);

  contextp.globalAlpha = 1;
  contextp.fillStyle = 'white';
  contextp.font = '36px monospace';
  contextp.textAlign = 'center';
  contextp.textBaseline = 'middle';
  contextp.fillText('GAME OVER!', canvasp.width / 2, canvasp.height / 2);
}
function placep(){
    canholdp = true;
    for (let row = 0; row < tetrominop.matrix.length; row++) {
    for (let col = 0; col < tetrominop.matrix[row].length; col++) {
      if (tetrominop.matrix[row][col]) {
	const r = tetrominop.row+row;
	const c = tetrominop.col+col;
	if (r < 0) continue;
	playfieldp[r][c] = tetrominop.name;
       }
    }
  }
let clearedp= 0;
for (let row = playfieldp.length - 1; row >= 0; row--) {
    if (playfieldp[row].every(cell => !!cell)) {
        clearedp++;

        for (let r = row; r > 0; r--) {
            playfieldp[r] = [...playfieldp[r - 1]];
        }
        playfieldp[0] = Array(playfieldp[0].length).fill(0);

        row++; 
    }
}

// Base scoring
let pointsp = 0;
if (clearedp === 1) pointsp = 100;
else if (clearedp === 2) pointsp = 300;
else if (clearedp === 3) pointsp = 500;
else if (clearedp === 4) pointsp = 800;
pointsp *= levelp;

if (clearedp > 0) {
  combop++;
  if (combop > 1) {
    const comboBonusp = 50 * combop * levelp;
    pointsp += comboBonusp;
  }
} else {
  combop = 0; // reset combo on any placement that doesn't clear a line
}

scorep += pointsp;
linesp += clearedp;
if (clearedp > 0){
  const scoreElp = document.getElementById("score-value-play");

  scoreElp.classList.remove("score-pulse-play");
  void scoreElp.offsetWidth;
  scoreElp.classList.add("score-pulse-play");
  showClearText(clearedp, combop);
}

document.getElementById("score-value-play").innerText = scorep;
document.getElementById("lines-value-play").innerText = linesp;
      tetrominop = nextpiecep();
 
 
  for (let row = 0; row < tetrominop.matrix.length; row++) {
      for (let col = 0; col < tetrominop.matrix[row].length; col++) {
        if (tetrominop.matrix[row][col]) {
        const r = tetrominop.row + row;
        const c = tetrominop.col + col;
        if (r >= 0 && playfieldp[r][c]) {
          showGameOverp();
          return;}
	}
      }
    }
}


let levelp = 1;
let linesp = 0;
let lastTimep = 0;          
let dropCountp = 0;       
let dropIp = 800; 


function drawBlockp(x,y, color) {
    // Base
    contextp.fillStyle = color;
    contextp.fillRect(x, y, gridp - 1, gridp - 1);

    // Top + left highlight
    contextp.fillStyle = "rgba(255,255,255,0.25)";
    contextp.fillRect(x, y, gridp - 1, 4);
    contextp.fillRect(x, y, 4, gridp - 1);

    // Bottom + right shadow
    contextp.fillStyle = "rgba(0,0,0,0.35)";
    contextp.fillRect(x, y + gridp - 5, gridp - 1, 4);
    contextp.fillRect(x + gridp - 5, y, 4, gridp - 1);
}

function getGhostPositionp(piece) {
    let ghostRow = piece.row;

    while (canmovep(piece.matrix, ghostRow + 1, piece.col)) {
        ghostRow++;
    }

    return ghostRow;
}
function showClearText(cleared, currentCombo) {
    const labels = { 1: 'SINGLE', 2: 'DOUBLE', 3: 'TRIPLE', 4: 'TETRIS!' };
    const colorsMap = { 1: '#ffffff', 2: '#00ff66', 3: '#ff8800', 4: '#00ffff' };
    clearAnimp = {
        text: labels[cleared],
        color: colorsMap[cleared],
        alpha: 1.0,
        y: canvasp.height / 2,
        timer: 0,
        duration: cleared === 4 ? 90 : 60
    };

    // Show combo badge when combo reaches 2+
    if (currentCombo >= 2) {
        comboAnimp = {
            text: `${currentCombo}x COMBO`,
            color: '#ffdd00',
            alpha: 1.0,
            y: canvasp.height / 2 + 50,
            timer: 0,
            duration: 80
        };
    }
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

function refillBagIfNeededp() {
    if (tseqp.length === 0) genSp();
}

function initializePreviewp() {
    refillBagIfNeededp();

    while (previewQueuep.length < PREVIEW_COUNTp) {
        refillBagIfNeededp();
        previewQueuep.push(tseqp.pop());
    }

    updatePreviewp();
}

function updatePreviewp() {
    for (let i = 0; i < PREVIEW_COUNTp; i++) {
        const canvas = document.getElementById(`next-${i}-play`);
        drawMiniPiece(canvas, previewQueuep[i]);
    }
}


function reset(){
tetrominop.row = 0;
tetrominop.col = playfieldp[0].length / 2 - Math.ceil(tetrominop.matrix[0].length / 2);
}
var hpiecep = "";
var canholdp = true;
function playerHold() {
    if(hpiecep === '' && canholdp){
        hpiecep = tetrominop.name;
	tetrominop = nextpiecep()
        reset();
        canholdp = false;
    }
    else if(canholdp){
        
        var temp = tetrominop.name;
	
        tetrominop = {
            name: hpiecep,
            matrix: tetrominos[hpiecep].map(r => [...r]),
            row: 0,
            col: 0
        };       
	reset();
        hpiecep = temp;
        canholdp = false;
    }}

function gameloopp(){
    rfp = requestAnimationFrame(gameloopp);
    if (!paused && !gameoverp){
    const currentT = Date.now()
    const deltaTime = currentT - lastTimep
    lastTimep = currentT
    dropCountp += deltaTime
    levelp = Math.floor(linesp / 10) +1;
    document.getElementById("level-value-play").innerText = levelp;

    
    const baseTime = 800;
    const minTime = 100;
    dropIp = Math.max(baseTime * Math.pow(0.9, levelp - 1),minTime);

 


if (dropCountp > dropIp) {
        tetrominop.row++;
	dropCountp = 0;

if (!canmovep(tetrominop.matrix, tetrominop.row, tetrominop.col)) {
            tetrominop.row--;
            placep();
        }
    }
  }else if (gameoverp){}




  contextp.clearRect(0,0,canvasp.width,canvasp.height);
  drawBackgroundp();
  drawCheckp();

  // Ghost Piece
const ghostRowp = getGhostPositionp(tetrominop);

contextp.save();
contextp.globalAlpha = 0.10;     
contextp.shadowBlur = 10;           
contextp.shadowColor = colors[tetrominop.name];

for (let row = 0; row < tetrominop.matrix.length; row++) {
    for (let col = 0; col < tetrominop.matrix[row].length; col++) {
        if (tetrominop.matrix[row][col]) {
            drawBlockp(
                (tetrominop.col + col) * gridp,
                (ghostRowp + row - hiddenp) * gridp,
                colors[tetrominop.name]
            );
        }
    }
}

contextp.restore();

  for (let row = hiddenp; row < hiddenp + visp; row++) {
        for (let col = 0; col < columns; col++) {
            if (playfieldp[row][col]) {
                const name = playfieldp[row][col];
                drawBlockp(
                  col * gridp,
                  (row - hiddenp) * gridp,
                  colors[name]
                );
            }
        }
    }

  
    contextp.fillStyle = colors[tetrominop.name];

for (let row = 0; row < tetrominop.matrix.length; row++) {
for (let col = 0; col < tetrominop.matrix[row].length; col++) {
if (tetrominop.matrix[row][col]) {
drawBlockp(
    (tetrominop.col + col) * gridp,
    (tetrominop.row + row - hiddenp) * gridp,
    colors[tetrominop.name]
);
        }
      }
    } 
    if (clearAnimp) {
    clearAnimp.timer++;
    clearAnimp.y -= 0.5;
    if (clearAnimp.timer > clearAnimp.duration - 20) {
        clearAnimp.alpha = (clearAnimp.duration - clearAnimp.timer) / 20;
    }

    contextp.save();
    contextp.globalAlpha = Math.max(0, clearAnimp.alpha);
    contextp.font = `bold ${clearAnimp.text === 'TETRIS!' ? '48' : '36'}px monospace`;
    contextp.textAlign = 'center';
    contextp.textBaseline = 'middle';

    contextp.shadowColor = clearAnimp.color;
    contextp.shadowBlur = 20;
    contextp.fillStyle = clearAnimp.color;
  contextp.fillText(clearAnimp.text, canvasp.width / 2, clearAnimp.y);

    if (clearAnimp.text === 'TETRIS!') {
        contextp.shadowBlur = 40;
        contextp.fillText(clearAnimp.text, canvasp.width / 2,clearAnimp.y);
    }

    contextp.restore();

    if (clearAnimp.timer >= clearAnimp.duration) clearAnimp = null;
  }

  // Combo animation — shown below the clear text
  if (comboAnimp) {
    comboAnimp.timer++;
    comboAnimp.y -= 0.4;
    if (comboAnimp.timer > comboAnimp.duration - 20) {
      comboAnimp.alpha = (comboAnimp.duration - comboAnimp.timer) / 20;
    }

    contextp.save();
    contextp.globalAlpha = Math.max(0, comboAnimp.alpha);
    contextp.font = 'bold 28px monospace';
    contextp.textAlign = 'center';
    contextp.textBaseline = 'middle';
    contextp.shadowColor = comboAnimp.color;
    contextp.shadowBlur = 18;
    contextp.fillStyle = comboAnimp.color;
    contextp.fillText(comboAnimp.text, canvasp.width / 2, comboAnimp.y);
    contextp.restore();

    if (comboAnimp.timer >= comboAnimp.duration) comboAnimp = null;
  }

  // Combo counter badge (persistent while combo is active)
  if (combop >= 2) {
    contextp.save();
    contextp.font = 'bold 14px monospace';
    contextp.textAlign = 'left';
    contextp.textBaseline = 'top';
    contextp.fillStyle = 'rgba(0,0,0,0.55)';
    contextp.fillRect(6, 6, 110, 26);
    contextp.fillStyle = '#ffdd00';
    contextp.shadowColor = '#ffdd00';
    contextp.shadowBlur = 10;
    contextp.fillText(`COMBO x${combop}`, 12, 12);
    contextp.restore();
  }

  // --- OVERLAYS ---
  if (gameoverp) {
    contextp.fillStyle = 'black';
    contextp.globalAlpha = 0.75;
    contextp.fillRect(0, canvasp.height / 2 - 30, canvasp.width, 60);
    contextp.globalAlpha = 1;
    contextp.fillStyle = 'white';
    contextp.font = '36px monospace';
    contextp.textAlign = 'center';
    contextp.textBaseline = 'middle';
    contextp.fillText('GAME OVER!', canvasp.width / 2, canvasp.height / 2);
  } else if (paused) {
    contextp.save();
    contextp.fillStyle = 'rgba(0, 0, 0, 0.5)';
    contextp.fillRect(0, 0, canvasp.width, canvasp.height);

    contextp.fillStyle = '#ffffff';
    contextp.font = '36px monospace';
    contextp.textAlign = 'center';
    contextp.textBaseline = 'middle';
    contextp.fillText('PAUSED', canvasp.width / 2, canvasp.height / 2);
    contextp.restore();
  }
}




  

document.addEventListener('keydown', function(e) {
       if (gameoverp) return;
if (e.key === 'p' || e.key === 'P') {
    paused = !paused;

    const btn = document.getElementById("pause-btn");
    if (btn) btn.innerText = paused ? "Resume" : "Pause";

    if (!paused) {
      lastTime = Date.now();
    }

    return;
  }
  if (paused) return;
  // left and right arrow keys (move)
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    const col = e.key === "ArrowLeft"
      ? tetrominop.col - 1
      : tetrominop.col + 1;

    if (canmovep(tetrominop.matrix, tetrominop.row, col)) {
      tetrominop.col = col;
    }
  }
  if (e.key === "ArrowUp"){
	const matrix = rotate(tetrominop.matrix);
	if (canmovep(matrix,tetrominop.row,tetrominop.col)){
		tetrominop.matrix = matrix;
		}
	}
  if (e.key === " "){
	dropp(tetrominop.matrix,tetrominop);	
	}
  if(e.key === "ArrowDown") {
    const row = tetrominop.row + 1;
	dropIp = 0
    if (!canmovep(tetrominop.matrix, row, tetrominop.col)) {	
      tetrominop.row = row - 1;

      placep();
      return;
    }
    tetrominop.row = row;
    	}
  if (e.key ==="c" || e.key === "C"){
	playerHold();
		}
     
});
if (pauseBtn) {
  pauseBtn.addEventListener("click", () => {
    paused = !paused;
    pauseBtn.innerText = paused ? "Resume" : "Pause";
    if (!paused) {
      lastTimep = Date.now(); 
    }
  });
}

function scaleToFitp() {
    const wrapper = document.getElementById('game-wrapper');
    const availableH = window.innerHeight * 0.95;
    const wrapperH = wrapper.scrollHeight;
    const scale = Math.min(1, availableH / wrapperH);
    wrapper.style.transform = `scale(${scale})`;
}

scaleToFitp();
window.addEventListener('resize', scaleToFit);


document.addEventListener('DOMContentLoaded', () => {
	initializePreviewp();
        tetrominop = nextpiecep();
	lastTimep = Date.now();
	rfp = requestAnimationFrame(gameloopp);
})


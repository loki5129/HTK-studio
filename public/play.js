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

for (let i = 0; i < hiddenp; i++) {
  playfieldp.push(Array(columnsp).fill(0));
}

for (let i = 0; i < visp; i++) {
  playfieldp.push(Array(columnsp).fill(0));
}

let tetrominop = nextpiecep()
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
    if (tseqp.length ==0){
        genSp();
    }
    const name = tseqp.pop();
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
scorep += pointsp;
linesp += clearedp;

document.getElementById("score-value-play").innerText = scorep;

//console.log("Score:", scorep, "Lines:", lines);
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


function gameloopp(){
   // console.log(score);
   if (gameoverp){
	showGameOverp();
	return
	}
    rfp = requestAnimationFrame(gameloopp);
    
    const currentT = Date.now()
    const deltaTime = currentT - lastTimep
    lastTimep = currentT
    dropCountp += deltaTime
    levelp = Math.floor(linesp / 10) +1;

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
       
  }

document.addEventListener('keydown', function(e) {
       if (gameoverp) return;
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
     
});
	

rfp = requestAnimationFrame(gameloopp); 

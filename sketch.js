
function randint(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function genS(){
    const seq =  ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
     while (seq.length) {
    const rand = randint(0, seq.length - 1);
    const name = seq.splice(rand, 1)[0];
    tseq.push(name);
  }
}
function nextpiece(){
    if (tseq.length ==0){
        genS();
    }
    const name = tseq.pop();
    const matrix = tetrominos[name];
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

    // I starts on row 21 (-1), all others start on row 22 (-2)
    const row = name === 'I' ? -1 : -2;

    return {
        name: name,      // name of the piece (L, O, etc.)
        matrix: matrix,  // the current rotation matrix
        row: row,        // current row (starts offscreen)
        col: col         // current col
  };
}


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
const colors = {
  'I': 'cyan',
  'O': 'yellow',
  'T': 'purple',
  'S': 'green',
  'Z': 'red',
  'J': 'blue',
  'L': 'orange'
};








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
function place(){
     for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {

        // game over if piece has any part offscreen
        if (tetromino.row + row < 0) {
          return showGameOver();
        }

        playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
      }
    }
  }


}
let count =0
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 32;
const tseq = [];
const playfield = [];

let rf = null;  // keep track of the animation frame so we can cancel it


for (let row = -2; row < 20; row++) {
  playfield[row] = [];

  for (let col = 0; col < 10; col++) {
    playfield[row][col] = 0;
  }
}
let tetromino = nextpiece();
function gameloop(){
    rf = requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);

  // draw the playfield
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 10; col++) {
      if (playfield[row][col]) {
        const name = playfield[row][col];
        context.fillStyle = colors[name];
        context.fillRect(col * grid, row * grid, grid-1, grid-1);}}}
  if (tetromino){
    if (++count > 35){
      tetromino.row++
      count=0
    }


  }





  }




function rotate(matrix) {
	const N = matrix.length - 1;
	const result = matrix.map((row,i)=>
	row.map((val,j)=> matrix[N-j][i]));
	return result;
}

function rotations(piece) {
	let rotations = [piece.matrix]; // start with current rotation
for (let i = 1; i < 4; i++) {
    const newRotation = rotate(rotations[i-1]);
    // Only keep unique rotations
 if (!rotations.some(r => JSON.stringify(r) === JSON.stringify(newRotation))) {
        rotations.push(newRotation);}}
return rotations;}

export function allPos(piece,play) {
	let placement = []
	//rotation = rotations(piece);
	//for (r in rotation){
	console.log(piece)	
	//}
}

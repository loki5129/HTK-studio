import * as mathFunctions from './math.js';

export function score(play,weights){
	//score = -w * height + s * complete lines - n * holes - j * bumpiness
//where w,s,n,j are postive values
//or
// score = − (Landing height) + (Eroded piece cells) − (Row transitions)− (Column transitions) − 4 × (Holes) − (Cumulative wells)
	let nums = mathFunctions.mathness(play);
	let w = weights[0];
	let s = weights[1];
	let n = weights[2];
	let j = weights[3];
let value = (-1 * w) * nums[0] +
	    s * nums[1] - 
	    n * nums[2] - 
	    j * nums[3];
return value;
}
function generateGaussian(mean,std){
  var _2PI = Math.PI * 2;
  var u1 = Math.random();
  var u2 = Math.random();
  
  var z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(_2PI * u2);
  var z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(_2PI * u2);

  return z0 * std + mean;
}
function genWeights(){
	let induvial = [generateGaussian(0,1),generateGaussian(0,1),generateGaussian(0,1),generateGaussian(0,1)];
	return induvial;
}
function genPop(N){
	let population = [];
	for (let i=0; i< N; i++){
		population.push(genWeights());
	}
	return population
}
getFitness(weights){
	let totalLines=0;
	let gamesToPlay = 5;
	for (let i = 0; i < gamesToPlay; i++) {
		let result = runGame(weights);
		totalLines += result.lines
        }
 return totalLines / gamesToPlay;}
function mutate(weights, mutationRate = 0.1, mutationStd = 0.5) {
    // weights: array of floats
    // mutationRate: chance each weight mutates
    // mutationStd: standard deviation of change
    
    const newWeights = weights.map(w => {
        if (Math.random() < mutationRate) {
            // add small Gaussian noise
            const change = generateGaussian(0, mutationStd);
            return w + change;
        } else {
            return w; // no change
        }
    });
    
    return newWeights;
}
function crossover(parent1, parent2) {
    const child = parent1.map((w, i) => {
        return Math.random() < 0.5 ? w : parent2[i];
    });
    return child;
}
function selction(pop, )
export function runGa(N){


} 

import * as mathFunctions from './math.js';
import { runGame } from './engine.js';
import fs from "fs"
import cliProgress from 'cli-progress';
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
//console.log(value)
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
        let induvial = [generateGaussian(-5,5),generateGaussian(-5,5),generateGaussian(-5,5),generateGaussian(-5,5)];
	return induvial;
}
function genPop(N){
	let population = [];
	for (let i=0; i< N; i++){
	const induvial = {weights:genWeights(),fitness: 0}
	population.push(induvial);
	}
	return population
}
function getFitness(weights){
	let totalLines=0;
	let gamesToPlay = 1;
	for (let i = 0; i < gamesToPlay; i++) {
		let result = runGame(weights);
		totalLines += result.lines
        }
 return totalLines / gamesToPlay;}
function mutate(weights, mutationRate = 0.3, mutationStd = 1.5) {
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
function selction(pop, k =5){
	let best = null;
	for (let i = 0; i < k; i++) {
const ind = pop[Math.floor(Math.random() * pop.length)];
        if (!best || ind.fitness > best.fitness) {
            best = ind;
        }
	}
	return best
}
function injectRandom(pop, fraction = .2){
	 const numToInject = Math.floor(pop.length * fraction)
	for (let i =0;i<numToInject;i++){
	const idx = Math.floor(Math.random() * pop.length);
        pop[idx] = {weights: genWeights(),fitness: 0}}}

export function runGA(N,generations){
	let topgen = [];
	let population = genPop(N);
	for (let i=0; i<N;i++){
		population[i].fitness = getFitness(population[i].weights)	}
const bar = new cliProgress.SingleBar({
	format:'Gen {value}/{total} |{bar}| Best: {best} Avg:{avg}'
	}, cliProgress.Presets.shades_classic);
 
    bar.start(generations, 0,{best: 0,avg: 0});

for (let g =0; g <generations; g++){
	const newpop = []
const elites = [...population]
    .sort((a,b)=>b.fitness - a.fitness)
    .slice(0, Math.floor(N * 0.05));
	const top =  [...population].sort((a,b)=>b.fitness - a.fitness)[0]
	newpop.push(...elites.map(e => ({...e})));
	topgen.push(...elites.map(e => ({...e})));
while (newpop.length<N){
	const parent1 = selction(population);
	const parent2 = selction(population);
	let childWeights = crossover(parent1.weights,parent2.weights);
	childWeights = mutate(childWeights);
let child = {
	weights: childWeights,
	fitness: getFitness(childWeights) 
	}
	newpop.push(child);
	}
	
	injectRandom(newpop, 0.1)
	population = newpop
const avgFitness =population.reduce((sum, ind) => sum + ind.fitness, 0) / N;

	bar.update(g + 1, {
            best: top.fitness.toFixed(2),
            avg: avgFitness.toFixed(2)
        });	
}	

bar.stop()
const jsonString = JSON.stringify(topgen, null, 2);
fs.writeFileSync("fitness.json", jsonString);

console.log("Array saved to topFitness.json");
return population
}


 

import * as mathFunctions from './math.js';
import { runGame } from './engine.js';
import fs from "fs"
import cliProgress from 'cli-progress';
import os from "os"
import { Worker } from 'worker_threads';
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
    let value = nums[0] * w + nums[1] * s + nums[2] * n + nums[3] * j
//console.log(value)
return value;
}

function normalize(weights) {
    const norm = Math.sqrt(weights.reduce((sum, w) => sum + w*w, 0));
    return weights.map(w => w / norm);
}



function generateGaussian(mean,std){
  var _2PI = Math.PI * 2;
  var value;
  
  var u1 = Math.random();
  var u2 = Math.random();
  var z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(_2PI * u2);
  var z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(_2PI * u2);
  value = z0 * std +mean;
   
   return value;
  }
function genWeights(){
        let induvial = [generateGaussian(0,1),generateGaussian(1,1),generateGaussian(-1,1),generateGaussian(-1,1)];
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



async function evalPop(population){
	const numWorkers = os.cpus().length;
	const chunkSize = Math.ceil(population.length / numWorkers);
    	const chunks = [];
	for (let i = 0; i < population.length; i += chunkSize) {
        chunks.push(
            population.slice(i, i + chunkSize)
                .map((ind, idx) => ({
                    weights: ind.weights,
                    index: i + idx
                }))
        );
    }
    const promises = chunks.map(chunk =>
        new Promise((resolve, reject) => {
	const worker = new Worker("./workers.js",{
	workerData: chunk
	});
	worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', code => {
                if (code !== 0)
                reject(new Error(`Worker exited with code ${code}`))
		})}))
	const results = await Promise.all(promises);
	results.flat().forEach(r => {
        population[r.index].fitness = r.fitness;
    });
}




function mutate(weights, mutationRate = 0.3, mutationStd = 1.5, generation=1) {
    // weights: array of floats
    // mutationRate: chance each weight mutates
    // mutationStd: standard deviation of change
    const decay = .995
    const effectiveStd = mutationStd * Math.pow(decay, generation);
    const newWeights = weights.map(w => {
        if (Math.random() < mutationRate) {
            // add small Gaussian noise
            const change = generateGaussian(0, effectiveStd);
            return w + change;
        } else {
            return w; // no change
        }
    });
    
    return newWeights;
}
function crossover(parent1, parent2, alpha = 0.1) {
    return parent1.map((w, i) => {
        const min = Math.min(w, parent2[i]);
        const max = Math.max(w, parent2[i]);
        const range = max - min;
        return Math.random() * (range * (1 + 2*alpha)) + (min - alpha*range);
    });
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

export async function runGA(N,generations){
	let topgen = [];
	let population = genPop(N);
 	await evalPop(population)	
const bar = new cliProgress.SingleBar({
	format:'Gen {value}/{total} |{bar}| Best: {best} Avg:{avg}'
	}, cliProgress.Presets.shades_classic);
 
    bar.start(generations, 0,{best: 0,avg: 0});

for (let g =0; g <generations; g++){
 	const sorted = [...population].sort((a,b)=>b.fitness - a.fitness);

        const eliteCount = Math.floor(N * 0.05);
        const elites = sorted.slice(0, eliteCount);
	const newpop = []
	
	newpop.push(...elites.map(e => ({
    	weights: [...e.weights],
    	fitness: e.fitness
	})));



	topgen.push(...elites.map(e => ({
            weights: [...e.weights],
            fitness: e.fitness
        })));

while (newpop.length<N){
	const parent1 = selction(population);
	const parent2 = selction(population);
	let childWeights = crossover(parent1.weights,parent2.weights);
	childWeights = normalize(mutate(childWeights,0.05,0.2, g));
	let child = {
		weights: childWeights,
		fitness: 0 
		}
	newpop.push(child);
	}
	
	injectRandom(newpop, 0.1)
	population = newpop

	await evalPop(population);
	const best = population.reduce((a,b)=>a.fitness>b.fitness?a:b);
	const avgFitness =population.reduce((sum, ind) => sum + ind.fitness, 0) / N;

	bar.update(g + 1, {
            best: best.fitness.toFixed(2),
            avg: avgFitness.toFixed(2)
        });	
}	

bar.stop()
const jsonString = JSON.stringify(topgen, null, 2);
fs.writeFileSync("fitness.json", jsonString);

console.log("Array saved to topFitness.json");
return population
}


 

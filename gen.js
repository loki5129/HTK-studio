import * as mathFunctions from './math.js';
import { runGame } from './engine.js';
import fs from "fs"
import cliProgress from 'cli-progress';
import os from "os"
import { Worker } from 'worker_threads';
export function score(play,weights,eroded,piece){
//score = -w * height + s * complete lines - n * holes - j * bumpiness
//where w,s,n,j are postive values
//or
// score = − (Landing height) + (Eroded piece cells) − (Row transitions)− (Column transitions) − 4 × (Holes) − (Cumulative wells)
	
	let nums = mathFunctions.mathness(play,piece);
	//console.log("PIECEE: "+piece)
	//console.log("NUMDERS: "+nums)
	//console.log("erored: "+ eroded)
	//console.log("WEIGHTS: "+ weights);
	return(
	(nums[0] * weights[0]) + // total height -
	(nums[1] * weights[1]) + // complete lines +
	(nums[2] * weights[2]) + // holes - 
	(nums[3] * weights[3]) + // bumpiness - 
	(nums[4] * weights[4]) +  // row transitions -
	(nums[5] * weights[5]) + // col transitions - 
	(nums[6] * weights[6]) + // Cumulativewelss -
	(nums[7] * weights[7]) + // landing height -
	(eroded * weights[8]) // eroded +
	)
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
let induvial = [
generateGaussian(-1,1),//total heighy
generateGaussian(1,1), // complete liens
generateGaussian(-1,1), //holes
generateGaussian(-1,1), // bumpiness
generateGaussian(-1, 1), // row transitions
generateGaussian(-1, 1), // col transitions
generateGaussian(-1, 1), // Cumulative welss
generateGaussian(-1, 1),  //erorded
generateGaussian(1,1) // landing height/
];
	//console.log(induvial)
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
    const decay = .97
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
function crossover(parent1, parent2 ){
    return parent1.map((w, i) => 
   	Math.random()< 0.5 ? w : parent2[i] 
    );
}
function selction(pop, k =3){
	let best = null;
	for (let i = 0; i < k; i++) {
const ind = pop[Math.floor(Math.random() * pop.length)];
        if (!best || ind.fitness > best.fitness) {
            best = ind;
        }
	}
	return best
}
function injectRandom(pop, fraction = .1){
	 const numToInject = Math.floor(pop.length * fraction)
	for (let i =0;i<numToInject;i++){
	const idx = Math.floor(Math.random() * pop.length);
        pop[idx] = {weights: genWeights(),fitness: 0}}}

const ISLAND_COUNT = 4;
const MIGRATION_INTERVAL = 10

function splitIntoIslands(population, count) {
    const size = Math.ceil(population.length / count);
    return Array.from({ length: count }, (_, i) =>
        population.slice(i * size, (i + 1) * size)
    );
}

function mergeIslands(islands) {
    return islands.flat();
}

function migrateIslands(islands) {
    // Each island sends its best individual to a random different island.
    const migrants = islands.map(island =>
        [...island].sort((a, b) => b.fitness - a.fitness)[0]
    );
    islands.forEach((island, i) => {
        let target;
        do { target = Math.floor(Math.random() * islands.length); } while (target === i);
        // Replace a random non-top-5 slot in the target island.
        const slot = 5 + Math.floor(Math.random() * Math.max(1, island.length - 5));
        if (slot < islands[target].length) {
            islands[target][slot] = { weights: [...migrants[i].weights], fitness: migrants[i].fitness };
        }
    });
}




export async function runGA(N,generations){
	let topgen = [];
	let population = genPop(N);
 	await evalPop(population)	
const bar = new cliProgress.SingleBar({
	format:'Gen {value}/{total} |{bar}| Best: {best} Avg:{avg}'
	}, cliProgress.Presets.shades_classic);
 
    bar.start(generations, 0,{best: 0,avg: 0});


    let islands = splitIntoIslands(population,ISLAND_COUNT);


for (let g =0; g <generations; g++){
if (g > 0 && g % MIGRATION_INTERVAL === 0) {
            migrateIslands(islands);
        }
 	const newIslands = islands.map(island => {
const sorted = [...island].sort((a, b) => b.fitness - a.fitness);
const eliteCount = Math.max(1, Math.floor(island.length * 0.05));
        const newIsland = sorted.slice(0, eliteCount).map(e => ({
                weights: [...e.weights], fitness: e.fitness
            }));
	  while (newIsland.length < island.length) {
                const p1 = selction(island);
                const p2 = selction(island);
                let childWeights = crossover(p1.weights, p2.weights);
                childWeights = mutate(childWeights, 0.3, 1.5, g);
                newIsland.push({ weights: childWeights, fitness: 0 });
            }

            if (g > 10) injectRandom(newIsland, 0.1);
            return newIsland;
        });

	islands = newIslands;
        population = mergeIslands(islands);   // flatten for eval
        await evalPop(population);
        islands = splitIntoIslands(population, ISLAND_COUNT)
const sorted = [...population].sort((a, b) => b.fitness - a.fitness);
        const eliteCount = Math.floor(N * 0.05);
        topgen.push(...sorted.slice(0, eliteCount).map(e => ({
            weights: [...e.weights], fitness: e.fitness
        })));
	const best = sorted[0];
        const avgFitness = population.reduce((sum, ind) => sum + ind.fitness, 0) / N;
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


 

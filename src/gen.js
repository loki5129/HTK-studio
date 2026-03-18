import * as mathFunctions from './math.js';
import { runGame } from './engine.js';
import fs from "fs"
import cliProgress from 'cli-progress';
import os from "os"
import { fileURLToPath } from 'url';
import path from 'path';
import { Worker } from 'worker_threads';
export function score(play,weights,eroded,piece){
//score = -w * height + s * complete lines - n * holes - j * bumpiness
//where w,s,n,j are postive values
//or
// score = − (Landing height) + (Eroded piece cells) − (Row transitions)− (Column transitions) − 4 × (Holes) − (Cumulative wells)
	
	let nums = mathFunctions.mathness(play,piece);

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
  const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(Math.PI * 2 * u2);
    return z0 * std + mean;
   
  
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
generateGaussian(-1, 1),  //landing heifhts
generateGaussian(1,1)  // eroded
];
	//console.log(induvial)
	return induvial;
}
function genPop(N){
    return Array.from({ length: N }, () => ({ weights: genWeights(), fitness: 0 }));
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
class Workers{
	constructor(path,size){
	this.workers = Array.from({length:size},() => ({
		worker : new Worker(path),
		busy : false
		}))
	this.queue = []
	}
    _dispatch(chunk){
        return   new Promise((resolve, reject) => {
	const task = {chunk,resolve,reject};
	const slot = this.workers.find(w => !w.busy);
	if (slot){
		this._run(slot,task)
	}else{
	this.queue.push(task);
		}
    	});
    }
    _run(slot,task){
	slot.busy = true
	const onMessage = result =>{
		slot.worker.removeListener('error',onError);
		slot.busy = false;
		task.resolve(result);
		if (this.queue.length>0){
			this._run(slot,this.queue.shift())
			}

		}
	const onError = err => {
        slot.worker.removeListener('message', onMessage);
        slot.busy = false;
        task.reject(err);
        if (this.queue.length > 0) {
            this._run(slot, this.queue.shift());
        }
    };
	

    slot.worker.once('message', onMessage);
    slot.worker.once('error', onError);
    slot.worker.postMessage(task.chunk);
	}
    async evaluate(population) {
        // Only evaluate individuals with fitness === 0 (new/mutated children).
        // Elites already have known fitness — skip them entirely.
        const toEval = population
            .map((ind, index) => ({ ind, index }))
            .filter(({ ind }) => ind.fitness === 0);

        if (toEval.length === 0) return;

        const numWorkers = this.workers.length;
        const chunkSize = Math.ceil(toEval.length / numWorkers);
        const chunks = [];
        for (let i = 0; i < toEval.length; i += chunkSize) {
            chunks.push(
                toEval.slice(i, i + chunkSize).map(({ ind, index }) => ({
                    weights: ind.weights,
                    index,
                }))
            );
        }

        const results = await Promise.all(chunks.map(c => this._dispatch(c)));
        results.flat().forEach(r => {
            population[r.index].fitness = r.fitness;
        });
    }

    terminate() {
        this.workers.forEach(({ worker }) => worker.terminate());
    }
}











function mutate(weights, mutationRate, mutationStd){
    return weights.map(w => 
    Math.random() < mutationRate
    ? w +generateGaussian(0,mutationStd)
    : w
    )
}
function crossover(parent1, parent2, alpha = 0.3){
   return parent1.map(( a , i )=> {
	const b = parent2[i];
	const lo = Math.min(a,b) -alpha * Math.abs(a-b);
	const hi = Math.max(a,b) + alpha * Math.abs(a - b);
	return lo + Math.random() * (hi - lo);
	});
	 
}
function selction(pop, k){
	let best = null;
	for (let i = 0; i < k; i++) {
const ind = pop[Math.floor(Math.random() * pop.length)];
        if (!best || ind.fitness > best.fitness) {
            best = ind;
        }
	}
	return best
}
function injectRandom(pop, fraction,eliteCount){
	 const numToInject = Math.floor(pop.length * fraction)
	for (let i =0;i<numToInject;i++){
const idx = eliteCount+ Math.floor(Math.random() * (pop.length-eliteCount));
        pop[idx] = {weights: genWeights(),fitness: 0}}}

const ISLAND_COUNT = 2;
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
const pool = new Workers(path.join(__dirname, 'workers.js'), os.cpus().length);
	let hall = []

	const islandSize = Math.floor(N/ISLAND_COUNT)
let islands = Array.from({length:ISLAND_COUNT},()=>genPop(islandSize))
	for (const island of islands) await pool.evaluate(island);
	const bar = new cliProgress.SingleBar({
	format:'Gen {value}/{total} |{bar}| Best: {best} Avg:{avg} hof: {hof}'
	}, cliProgress.Presets.shades_classic);
 
    bar.start(generations, 0,{best: 0,avg: 0,hof:0});



for (let g =0; g <generations; g++){

	if (g > 0 && g % MIGRATION_INTERVAL === 0) {
            migrateIslands(islands);
        }


	const mstd  = 1.5 * Math.pow(0.995,g);
	const mrate = Math.max(0.1,0.4-g*0.001);
	const k     = Math.min(3+Math.floor(g/10),20)
 	islands = islands.map(island => {
const sorted = [...island].sort((a, b) => b.fitness - a.fitness);
const eliteCount = Math.max(1, Math.floor(island.length * 0.1));
        const newIsland = sorted.slice(0, eliteCount).map(e => ({
                weights: [...e.weights], fitness: e.fitness
            }));
	  while (newIsland.length < island.length) {
                const p1 = selction(island,k);
                const p2 = selction(island,k);
                newIsland.push({ 
		weights: mutate(crossover(p1.weights,p2.weights),mrate,mstd), 
		fitness: 0 
		});
            }

            if (g > 10) injectRandom(newIsland, 0.08,eliteCount);
            return newIsland;
        });
	for (const island of islands) await pool.evaluate(island);
	const allInd = islands.flat();
	hall.push(...allInd.filter(ind => ind.fitness !== 0));
	hall.sort((a,b) => b.fitness - a.fitness)
	hall = hall.slice(0,20)
	const best = hall[0]
        const avg=allInd.reduce((sum, ind) => sum + ind.fitness, 0) / allInd.length;
	fs.writeFileSync(`checkpoint_gen${g}.json`, JSON.stringify({
    generation: g,
    best: hall[0],
    allInd
	}));
	bar.update(g + 1, {
            best: best?.fitness.toFixed(1) ?? 0,
            avg: avg.toFixed(1),
	    hof: hall[0]?.fitness.toFixed(1) ?? 0.
        });	


}	

bar.stop()
pool.terminate()
const jsonString = JSON.stringify(hall, null, 2);
fs.writeFileSync("fitness.json", jsonString);

console.log("Array saved to topFitness.json");
return islands.flat()
}


 

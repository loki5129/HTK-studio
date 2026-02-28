import { parentPort, workerData } from 'worker_threads';
import { runGame } from './engine.js';

function getFitness(weights) {
    let totalLines = 0;
    const gamesToPlay = 1;

    for (let i = 0; i < gamesToPlay; i++) {
        const result = runGame(weights);
        totalLines += result.lines;
    }

    return totalLines / gamesToPlay;
}

const results = workerData.map(ind => ({
    index: ind.index,
    fitness: getFitness(ind.weights)
}));

parentPort.postMessage(results);

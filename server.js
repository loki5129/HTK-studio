import express from "express"
import {bestMove} from "./model.js"
import {runGA} from "./gen.js"
import {runGame} from "./engine.js"
const app = express();

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self';"
  );
  next();
});

app.use(express.static("public"));
app.use(express.json());

app.post('/runGA', async (req, res) => {
    const { popSize = 50, generations = 20 } = req.body;
    console.log(runGame([0.5, -0.5, -0.5, 1.0]));
     console.log(`Running GA with popSize=${popSize}, generations=${generations}`);

    try {
        const finalPopulation = await runGA(popSize, generations);

        // Sort by fitness descending
        finalPopulation.sort((a, b) => b.fitness - a.fitness);
        const best = finalPopulation[0];

        res.json({
            bestWeights: best.weights,
            bestFitness: best.fitness,
            population: finalPopulation.map(ind => ({weights: ind.weights, fitness: ind.fitness}))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'GA failed' });
    }
});
app.post("/analyze", (req, res) => {
 //console.log("BODY:", req.body);
 const playfield = req.body.playfield;
 const piece = req.body.piece;
 // console.log(playfield);
 //console.log(piece); 
 let weights = [3.0114043736396034,4.773107227762628,6.468720418314,6.14979335396455]


 let move = bestMove(playfield,piece,weights)
   //console.log(typeof(piece))
  //console.log(piece.length)
  
 //console.log(move);
 //res.json({move})

});
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});


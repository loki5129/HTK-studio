import express from "express"
import {bestMove} from "./src/model.js"
import {runGA} from "./src/gen.js"

const app = express();

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self';"
  );
  next();
});


app.use(express.static("frontend"));
app.use(express.json());

app.post('/runGA', async (req, res) => {
    const { popSize = 50, generations = 20 } = req.body;

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
 const next = req.body.next;
 const held = req.body.held
 //console.log(playfield);
 //console.log(piece); 
// console.log(next);
// console.log("HELD: " + held);
 let weights = [-1.534542275492241,-0.1810270811186694,-1.883547189496421,-1.6653263509784657,-2.1990536788071235,-0.05579037469711157,-1.9657876795884994,-0.4184791626429063,1.5193199309116134]
  let move = bestMove(playfield,piece,next,held,weights)
 //console.log(move); 
 res.json({move})

});
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

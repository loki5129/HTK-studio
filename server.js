import express from "express"
import {bestMove} from "./model.js"
import {runGA} from "./gen.js"
import {runGame} from "./engine.js"
import {mathness} from "./math.js"
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
    console.log(runGame([
      -1.197797829039768,
      0.6474174876891019,
      -2.8833479949250598,
      -2.5218869939922164,
      -0.4607524621395642,
      -1.63969073716738,
      -1.5347502364529162,
      -0.8560507883771952,
      -0.822222222222222
]));
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
 //const held = req.body.held
 // console.log(playfield);
 //console.log(piece); 
 //console.log(next);
 let weights = [
      -1.197797829039768,
      0.6474174876891019,
      -2.8833479949250598,
      -2.5218869939922164,
      -0.4607524621395642,
      -1.63969073716738,
      -1.5347502364529162,
      -0.8560507883771952,
      -0.5
    ]
 let  m = mathness(playfield)
 //console.log("holes: " + m[2])
 //let move = bestMove(playfield,piece,next,held,weights)
   //console.log(typeof(piece))
  //console.log(piece.length)
  
 //console.log(move);
 res.json({move})

});
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});


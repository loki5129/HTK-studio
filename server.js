import express from "express"
import {bestMove} from "./model.js"

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

app.post("/analyze", (req, res) => {
 //console.log("BODY:", req.body);
 const playfield = req.body.playfield;
 const piece = req.body.piece;
 // console.log(playfield);
 //console.log(piece);

 // let move = bestMove(playfield,piece)
  
  //console.log(typeof(piece))
  //console.log(piece.length)
  
 //console.log(move);
 //res.json({move})

});
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});


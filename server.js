import express from "express"
import {mathness} from "./math.js"
import {allPos} from "./pos.js"
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
 let nums = mathness(playfield);  
 let pos = allPos(piece,playfield)
  //console.log(typeof(piece))
  //console.log(piece.length)
  res.json({nums});


});
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});


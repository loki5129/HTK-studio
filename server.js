import express from "express"
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

app.post("/analyze", (req, res) => {
  const playfield = req.body;   
  let nums = mathness(playfield);  
  res.json({nums});
 

});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});


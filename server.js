import express from "express"


const app = express();
app.use(express.json());

app.post("/analyze", (req, res) => {
  const result = "test";
  res.json(result);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});


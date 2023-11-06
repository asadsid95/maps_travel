const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

dotenv.config();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/process", (req, res) => {
  const location = req.body;
  res.json({ message: `hello` });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

dotenv.config();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

async function callGeocoding(location) {
  let pull = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.country}.json?access_token=${process.env.MAPBOX_PUBLIC}`
  );

  let response = await pull.json(); // returns json response as javascript object

  let coordinates = response.features[0].geometry.coordinates;
  return coordinates;
  //   let corrected_coordinates = [coordinates[1], coordinates[0]];

  //   return corrected_coordinates;
}

app.post("/process", async (req, res) => {
  const location = req.body;

  let corrected_coordinates = await callGeocoding(location);

  //   console.log("correct coor: ", corrected_coordinates);
  res.json({ corrected_coordinates: corrected_coordinates });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

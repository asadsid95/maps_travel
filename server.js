const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const app = express();

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mapping_users.db");

const user_table = require("./db/db_users");

// Check if the 'users' table exists, and create it if not

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// table creation if not existing
db.serialize(() => {
  db.get(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
    (err, row) => {
      if (!row) {
        // The 'users' table does not exist, so create it
        db.run(
          "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT UNIQUE, visitedCountries TEXT)"
        );
      } else {
        return err;
      }
    }
  );
});

async function callGeocoding(location) {
  try {
    let pull = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.country}.json?access_token=${process.env.MAPBOX_PUBLIC}`
    );

    let response = await pull.json(); // returns json response as javascript object

    let coordinates = response.features[0].geometry.coordinates;
    return coordinates;
  } catch (err) {
    console.log(err);
  }
}

app.post("/process", async (req, res) => {
  const location = req.body;

  let corrected_coordinates = await callGeocoding(location);

  res.json({ corrected_coordinates: corrected_coordinates });
});

// user registration
app.post("/registration", (req, res) => {
  const name = req.body.name;

  if (name.trim() === "" || name.length < 2) {
    return res
      .status(400)
      .json({ error: "user name is less than 2 characters" });
  }

  /*   
  send req.body to database for user creation
  ...
  */
  try {
    user_table.insertUser(db, name);

    res.status(200).json({ message: "User successfully created" });
  } catch (err) {
    return res
      .status(400)
      .json({ error: "[SERVER_ERROR] - Database operation did not complete" });
  }

  // redirect user to the main page
  // res.sendFile(path.join(__dirname, "/public/index.html"));
  // res.redirect("http://localhost:5500/public");
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

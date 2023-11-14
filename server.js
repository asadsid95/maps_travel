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
const checkTableQuery =
  "SELECT name FROM sqlite_master WHERE type='table' AND name='users'";

db.serialize(() => {
  db.get(checkTableQuery, (err, row) => {
    if (err) {
      console.error("Error checking for users table:", err);
    } else if (!row) {
      // The 'users' table does not exist, so create it
      const createTableQuery =
        "CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL)";

      db.run(createTableQuery, (err) => {
        if (err) {
          console.error("Error creating users table:", err);
        } else {
          console.log("Users table created successfully");
        }
      });
    } else {
      console.log("Users table already exists");
    }
  });
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
  const { username, password } = req.body.formData;

  // server-end side data validation
  if (
    username.trim() === "" ||
    username.length < 2 ||
    password.trim() === "" ||
    password.length < 2
  ) {
    alert("username must not be empty or be greater than 2 characters");
    return res.status(400).json({ error: "Invalid data" });
  }

  /*
  send req.body to database for user creation
  ...
  */

  user_table.insertUser(db, username, password, (err) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json({ success: true });
  });
});

// user authentication
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username.trim() === "" ||
    username.length < 2 ||
    password.trim() === "" ||
    password.length < 2
  ) {
    alert("username must not be empty or be greater than 2 characters");
    return res.status(400).json({ error: "Invalid data" });
  }

  /* 
    check if user exists
  */
  user_table.checkUser(
    db,
    username,
    password,
    (err, isAuthenticated, token) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (isAuthenticated) {
        res.status(200).json({ success: true, token });
      } else {
        res
          .status(401)
          .json({ success: false, error: "Authentication failed" });
      }

      // res.status(200).json({ success: true });
    }
  );
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

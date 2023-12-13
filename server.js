const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");

dotenv.config();
const app = express();

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("mapping_users.db");

const user_table = require("./db/db_users");

// Check if the 'users' table exists, and create it if not

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// middleware to server static files from node_modules for leaflet
app.use("/libs", express.static(path.join(__dirname, "node_modules")));

// middleware to serve associated css, js files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "dist")));

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

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.post("/process", async (req, res) => {
  const location = req.body;

  let corrected_coordinates = await callGeocoding(location);

  return res.json({ corrected_coordinates: corrected_coordinates });
});

// Serve registration HTML
app.get("/registration", (req, res) => {
  return res.sendFile(
    path.join(__dirname, "/public/registration/registration.html")
  );
});

// user registration
app.post("/registration", async (req, res) => {
  const { username, password } = req.body.formData;
  let hashed_password;

  // server-end side data validation
  if (
    username.trim() === "" ||
    username.length < 2 ||
    password.trim() === "" ||
    password.length < 2
  ) {
    // alert("username must not be empty or be greater than 2 characters");
    return res.status(400).json({ error: "Invalid data" });
  }

  /*
  send req.body to database for user creation
  ...
  */

  try {
    hashed_password = await bcrypt.hash(password, 10);
  } catch (err) {
    console.error("Error hashing password: ", err);
  }

  try {
    // Send req.body to the database for user creation
    await user_table.insertUser(db, username, hashed_password);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error during user registration:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

// Serve login HTML
app.get("/login", (req, res) => {
  return res.sendFile(path.join(__dirname, "/public/login/login.html"));
});

// user authentication
app.post("/login", async (req, res) => {
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

  try {
    const result = await user_table.checkUser(db, username, password);

    if (result.success) {
      return res
        .status(200)
        .json({ success: true, token: result.token, message: result.message });
    } else {
      return res
        .status(401)
        .json({ error: "Invalid credentials", message: result.message });
    }
  } catch (err) {
    console.error("Error during user logging in:", err);
    return res.status(500).json({ error: "Database error", success: false });
  }
});

app.get("/protected", (req, res) => {
  // console.log(req);

  console.log(req.headers.authorization);

  return res.status(200).json({ message: "Protected route" });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

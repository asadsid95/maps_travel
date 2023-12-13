const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

function insertUser(db, username, password) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      const insertQuery = db.prepare(
        "INSERT INTO users (username, password) VALUES (?,?)"
      );
      insertQuery.run([username, password], (err) => {
        if (err) {
          console.error("Error inserting user:", err);
          reject(err);
        } else {
          console.log("User inserted successfully");
          resolve();
        }
      });
      insertQuery.finalize();
    });
  });
}

// Function to compare passwords using bcrypt
async function comparePasswords(inputPassword, hashedPassword) {
  try {
    // Compare the input password with the hashed password using bcrypt
    const match = await bcrypt.compare(inputPassword, hashedPassword);

    return match;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
}

function checkUser(db, username, inputPassword) {
  return new Promise((resolve, reject) => {
    const checkQuery = db.prepare("SELECT * FROM users WHERE username = ?");

    const secretKey = process.env.SECRET_JWT || "hello-as-hard-coded";
    checkQuery.get(username, async (err, row) => {
      if (err) {
        console.error("Error finding user:", err);
        reject(err);
      } else {
        if (row) {
          console.log("User found successfully; checking password");

          const passwordMatch = await comparePasswords(
            inputPassword,
            row.password
          );
          if (passwordMatch) {
            // Generate a JWT with user information
            const token = jwt.sign(
              { userId: row.id, username: row.username },
              secretKey,
              { expiresIn: "1h" }
            );

            resolve({
              success: true,
              token: token,
              message: "Password matched",
            });
          } else {
            reject({
              success: false,
              token: null,
              message: "Password didnt match",
            });
          }
        } else {
          reject({ success: false, token: null, message: "User not found" });
        }
      }
      checkQuery.finalize();
    });
  });
}

module.exports = {
  insertUser,
  checkUser,
};

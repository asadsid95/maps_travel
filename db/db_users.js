const jwt = require("jsonwebtoken");

function insertUser(db, username, password, callback) {
  db.serialize(() => {
    const insertQuery = db.prepare(
      "INSERT INTO users (username, password) VALUES (?,?)"
    );
    insertQuery.run([username, password], (err) => {
      if (err) {
        console.error("Error inserting user:", err);
        callback(err);
      } else {
        console.log("User inserted successfully");
        callback(null);
      }
    });
    insertQuery.finalize();
  });
}

function checkUser(db, username, password, callback) {
  const checkQuery = db.prepare("SELECT * FROM users WHERE username = ?");

  const secretKey = process.env.SECRET_JWT;

  checkQuery.get(username, (err, row) => {
    if (err) {
      console.error("Error finding user:", err);
      callback(err, false, null);
    } else {
      if (row) {
        console.log("User found successfully");

        // Generate a JWT with user information
        const token = jwt.sign(
          { userId: row.id, username: row.username },
          secretKey,
          { expiresIn: "1h" }
        );

        callback(null, true, token);
      } else {
        console.log("User not found");
        callback(null, false, null);
      }
    }
  });
}

module.exports = {
  insertUser,
  checkUser,
};

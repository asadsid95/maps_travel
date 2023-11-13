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

  checkQuery.get(username, (err, row) => {
    if (err) {
      console.error("Error finding user:", err);
      callback(err, false);
    } else {
      if (row) {
        console.log("User found successfully");
        callback(null, true);
      } else {
        console.log("User not found");
        callback(null, false);
      }
    }
  });
}

module.exports = {
  insertUser,
  checkUser,
};

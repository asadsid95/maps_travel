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

module.exports = {
  insertUser,
};

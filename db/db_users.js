function insertUser(db, userData) {
  db.serialize(() => {
    const stmt = db.prepare("INSERT INTO users (name) VALUES (?)");
    stmt.run(userData);
    stmt.finalize();
  });
}

module.exports = {
  insertUser,
};

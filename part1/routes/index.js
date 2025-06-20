var express = require('express');
var router = express.Router();
var mysql = require('mysql2/promise');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

let db;

(async () => {
  try {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '' // Set your MySQL root password
    });

    // Create the database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS DogWalkService');
    await connection.end();

    // Now connect to the created database
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService',
      multipleStatements: true
    });

    // Create a table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS Users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('owner', 'walker') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS Dogs (
        dog_id INT AUTO_INCREMENT PRIMARY KEY,
        owner_id INT NOT NULL,
        name VARCHAR(50) NOT NULL,
        size ENUM('small', 'medium', 'large') NOT NULL,
        FOREIGN KEY (owner_id) REFERENCES Users(user_id)
      );

      CREATE TABLE IF NOT EXISTS WalkRequests (
        request_id INT AUTO_INCREMENT PRIMARY KEY,
        dog_id INT NOT NULL,
        requested_time DATETIME NOT NULL,
        duration_minutes INT NOT NULL,
        location VARCHAR(255) NOT NULL,
        status ENUM('open', 'accepted', 'completed', 'cancelled') DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (dog_id) REFERENCES Dogs(dog_id)
      );

      CREATE TABLE IF NOT EXISTS WalkApplications (
        application_id INT AUTO_INCREMENT PRIMARY KEY,
        request_id INT NOT NULL,
        walker_id INT NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
        FOREIGN KEY (walker_id) REFERENCES Users(user_id),
        CONSTRAINT unique_application UNIQUE (request_id, walker_id)
      );

      CREATE TABLE IF NOT EXISTS WalkRatings (
        rating_id INT AUTO_INCREMENT PRIMARY KEY,
        request_id INT NOT NULL,
        walker_id INT NOT NULL,
        owner_id INT NOT NULL,
        rating INT CHECK (rating BETWEEN 1 AND 5),
        comments TEXT,
        rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
        FOREIGN KEY (walker_id) REFERENCES Users(user_id),
        FOREIGN KEY (owner_id) REFERENCES Users(user_id),
        CONSTRAINT unique_rating_per_walk UNIQUE (request_id)
      );
    `);

    // Insert data if table is empty
    const [rows] = await db.execute('SELECT COUNT(*) AS count FROM Users');
    if (rows[0].count === 0) {
      await db.execute(`
        INSERT INTO Users (username, email, password_hash, role) VALUES ('alice123', 'alice@example.com', 'hashed123', 'owner');
        INSERT INTO Users (username, email, password_hash, role) VALUES ('bobwalker', 'bob@example.com', 'hashed456', 'walker');
        INSERT INTO Users (username, email, password_hash, role) VALUES ('carol123', 'carol@example.com', 'hashed789', 'owner');
        INSERT INTO Users (username, email, password_hash, role) VALUES ('merc123', 'merc@example.com', 'hashed012', 'walker');
        INSERT INTO Users (username, email, password_hash, role) VALUES ('user123', 'user@example.com', 'hashed345', 'owner');
      `);
    }
    const [rows2] = await db.execute('SELECT COUNT(*) AS count FROM Dogs');
    if (rows2[0].count === 0) {
      await db.execute(`
        INSERT INTO Dogs (owner_id, name, size) VALUES ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium');
        INSERT INTO Dogs (owner_id, name, size) VALUES ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small');
        INSERT INTO Dogs (owner_id, name, size) VALUES ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Sheep', 'large');
        INSERT INTO Dogs (owner_id, name, size) VALUES ((SELECT user_id FROM Users WHERE username = 'user123'), 'Cat', 'medium');
        INSERT INTO Dogs (owner_id, name, size) VALUES ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Duck', 'small');
      `);
    }
    const [rows3] = await db.execute('SELECT COUNT(*) AS count FROM WalkRequests');
    if (rows3[0].count === 0) {
      await db.execute(`
        INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open');
        INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES ((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted');
        INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES ((SELECT dog_id FROM Dogs WHERE name = 'Sheep'), '2025-06-10 09:00:00', 30, 'Parklands', 'completed');
        INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES ((SELECT dog_id FROM Dogs WHERE name = 'Cat'), '2025-06-10 10:00:00', 30, 'Parklands', 'open');
        INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES ((SELECT dog_id FROM Dogs WHERE name = 'Duck'), '2025-06-10 11:00:00', 30, 'Parklands', 'cancelled');
      `);
    }

  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();

router.get('/api/dogs', async (req, res) => {
  try {
    const [dogs] = await db.execute('SELECT Dogs.name AS dog_name, Dogs.size AS size, Users.username AS owner_username FROM Users INNER JOIN Dogs ON Users.user_id = Dogs.owner_id;');
    return res.json(dogs);
  } catch (dErr) {
    return res.status(500).json({ error: 'DB error' });
  }
});

router.get('/api/walkrequests/open', async (req, res) => {
  try {
    const [open] = await db.execute(`SELECT WalkRequests.request_id AS request_id, Dogs.name AS dog_name, WalkRequests.requested_time, WalkRequests.duration_minutes, WalkRequests.location, Users.username AS owner_username FROM Users INNER JOIN Dogs ON Users.user_id = Dogs.owner_id INNER JOIN WalkRequests ON Dogs.dog_id = WalkRequests.dog_id WHERE WalkRequests.status = 'open';`);
    return res.json(open);
  } catch (dErr) {
    return res.status(500).json({ error: 'DB error' });
  }
});

router.get('/api/walkers/summary', async (req, res) => {
  try {
    const [walker] = await db.execute(`SELECT Users.username AS walker_username, COUNT(WalkRating.walker_id WHERE WalkRating.walker_id = Users.user_id) AS total_rating, AVG(WalkRating.rating WHERE WalkRating.walker_id = Users.user_id) AS average_rating, COUNT(WalkApplication.walker_id WHERE WalkRequests.request_id = WalkRatings.user_id AND WalkRequests.status = 'complete'`);
    return res.json(walker);
  } catch (dErr) {
    return res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;

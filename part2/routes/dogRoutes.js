const express = require('express');
const router = express.Router();
const db = require('../models/db');


router.get('/', async (req, res) => {
  try {
    const [dogs] = await db.execute('SELECT Dogs.name AS dog_name, Dogs.size AS size, Users.username AS owner_username FROM Users INNER JOIN Dogs ON Users.user_id = Dogs.owner_id;');
    return res.json(dogs);
  } catch (dErr) {
    return res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;

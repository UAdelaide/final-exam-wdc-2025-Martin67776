const express = require('express');
const router = express.Router();
const db = require('../models/db');


router.get('/', async (req, res) => {
  try {
    const [dogs] = await db.execute('SELECT * FROM Dogs;');
    return res.json(dogs);
  } catch (dErr) {
    return res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;

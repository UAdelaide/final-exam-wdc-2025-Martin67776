const express = require('express');
const path = require('path');
const session = require('express-session');
const morgan = require('morgan');
const db = require('./models/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
    secret: '6845ED7F6TVYGOB8UI3QHP4EOGHAEROYIVBGUHDFJ',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000*60*60
    }
}));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');
app.get('/api/dogs', async (req, res) => {
  try {
    const [dogs] = await db.execute('SELECT * FROM Dogs;');
    return res.json({ dogs: dogs });
  } catch (dErr) {
    return res.status(500).json({ error: 'DB error' });
  }
});

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;

const express = require('express');
const path = require('path');
const session = require('express-session');
const morgan = require('morgan');
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

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;

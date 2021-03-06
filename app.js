'use strict';

const config = require('./config');
const mongoDB = require('./db/mongodb');

require('./config/passportConfig');

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const rtsIndex = require('./routes/index.router');

mongoDB.connectToDB();

var app = express();

app.disable('etag');

// [START enable_parser]
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
  extended: true 
}));
// [END enable_parser]
app.use(cors());
// [START SETUP PASSPORT]
app.use(passport.initialize());
// [END SETUP PASSPORT]

app.use('/api', rtsIndex);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/status', (req, res) => {
  res.status(200).json({message: 'Welcome to Predictive PoS Cloud!'});
});

// Basic 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Basic error handler
app.use((err, req, res) => {
  /* jshint unused:false */
  console.error(err);
  // If our routes specified a specific response, then send that. Otherwise,
  // send a generic message so as not to leak anything.
  res.status(500).send(err.response || 'Something broke!');
});


if (module === require.main) {
  // [START server]
  // Start the server
  const server = app.listen(config.get('PORT') || 3000, () => {
  console.log(`Welcome to Sample NodeJS & Express App`)
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
  // [END server]
}

module.exports = app;
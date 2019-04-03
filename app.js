'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');

const app = express();

app.disable('etag');

// [START enable_parser]
app.use(bodyParser.urlencoded({ extended: true }));
// [END enable_parser]

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.status(200).json({message: 'Hello, world!'});
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
  const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Welcome to Sample NodeJS & Express App`)
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
  // [END server]
}

module.exports = app;

